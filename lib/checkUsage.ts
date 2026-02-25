import Usage from "@/models/UsageModel";
import { getUserSubscription } from "./getUserSubscription";

export async function checkAndIncrementUsage(userId: string) {

  const checkusage = await checkUsage(userId);

  if (checkusage.allowed) {
    await Usage.findOneAndUpdate(
      { userId },
      { $inc: { count: 1 } },
      { new: true }
    );
  }
  return checkusage;
}

export async function checkUsage(userId : string){

  const {subscription} = await getUserSubscription();
  const limit = subscription.plan==="premium" ? 999 : 25;

  const today = new Date().toISOString().split("T")[0];

  let usage = await Usage.findOne({
    userId
  }); 
  if (!usage) {
    usage = await Usage.create({
      userId,
      date: today,
      count: 0
    });
  }
    if (usage.date !== today) {
        usage.count = 0;
        usage.date = today;
        await usage.save();
    } 
    const remaining = Math.max(0, limit - usage.count); 
    return {
      allowed: usage.count < limit,
      remaining,
      message: usage.count >= limit ? "plan limit reached" : "Allowed"
    };

}
