import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["null", "free", "premium"],
      default: "null",
    },

    status: {
      type: String,
      enum: ["pending","active", "cancelled", "expired"],
      default: "pending",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    stripeCustomerId: {
      type: String,
    },

    stripeSubscriptionId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);