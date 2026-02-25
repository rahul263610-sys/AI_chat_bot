import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";
import { stripe } from "@/lib/stripe";
import Subscription from "@/models/SubscriptionModel";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectDB();
console.log("🔥 Stripe webhook hit");
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No Stripe signature found" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;

      if (!userId) {
        return NextResponse.json(
          { error: "User ID not found in metadata" },
          { status: 400 }
        );
      }
      const stripeSubscription: Stripe.Subscription =
        await stripe.subscriptions.retrieve(
          session.subscription as string
        );

      const item = stripeSubscription.items.data[0];

      const startDate = new Date(item.current_period_start * 1000);
      const endDate = new Date(item.current_period_end * 1000);

      await Subscription.findOneAndUpdate(
        { user: new mongoose.Types.ObjectId(userId) },
        {
          plan: "premium",
          status: "active",
          startDate,
          endDate,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        }
      );
    }
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        {
          status: "cancelled",
          plan: "free",
        }
      );
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}