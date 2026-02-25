import { NextResponse } from "next/server";
import { getUserSubscription } from "@/lib/getUserSubscription";

export async function POST() {
  try {
    const result = await getUserSubscription();

    if ("error" in result) {
      return NextResponse.json(
        { message: result.error },
        { status: result.status }
      );
    }

    const { subscription } = result;

    subscription.plan = "free";
    subscription.status = "active";
    subscription.startDate = new Date();

    await subscription.save();

    return NextResponse.json({
      message: "Free plan activated",
      subscription,
    });

  } catch (error) {
    console.error("Free plan error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}