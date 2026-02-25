import { connectDB } from "@/lib/mongodb";
import { getCurrentUserDetails } from "@/lib/auth";
import Subscription from "@/models/SubscriptionModel";

export const getUserSubscription = async () => {
  await connectDB();

  const user = await getCurrentUserDetails();

  if (!user) {
    return {
      error: "Unauthorized",
      status: 401,
    };
  }

  const subscription = await Subscription.findOne({
    user: user._id,
  });

  if (!subscription) {
    return {
      error: "Subscription not found",
      status: 404,
    };
  }

  return {
    user,
    subscription,
  };
};