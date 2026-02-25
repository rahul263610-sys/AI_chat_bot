import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUserDetails } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";

export async function POST(){
    try{
        await connectDB();
        const user = await getCurrentUserDetails();
        if(!user){
            return NextResponse.json({message : "Unauthorized" },{status:401});
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer_email: user.email,
            metadata: {
                userId: user._id.toString(),
                name: "AI chatbot"
            },
            line_items:[
                {
                    price_data:{
                        currency: "inr",
                        product_data:{
                            name:"AI Chat Bot premium plan",
                        },
                        unit_amount: Number(process.env.SUBSCRIPTION_PLAN) * 100,
                        recurring:{
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url : `${process.env.NEXT_PUBLIC_BASE_URL}/choose-plan`,
        })
        return NextResponse.json({url: session.url});
    }catch(error){
         console.error("Stripe error:", error);
        return NextResponse.json({ message: "Error creating session" }, { status: 500 });
    }
}

//paycool------------------

// import { getCurrentUserDetails } from "@/lib/auth";
// import { getCurrentUser } from "@/redux/slices/authSlice";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     // const { amount, currency, email, orderId, gateway } = await req.json();
//     const user = await getCurrentUserDetails();
//     console.log("user = ",user)
//     const response = await fetch(
//       `https://paycoolbackend.onrender.com/api/payments/pay/699d68ad2c65134f64bb12a2/stripe`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//          amount: 599,
//           currency: "INR",
//           customerEmail: user?.email,
//           orderId:user?._id,
//         }),
//       }
//     );

//     const data = await response.json();

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Payment initiation failed" },
//       { status: 500 }
//     );
//   }
// }