import mongoose from "mongoose";

const UsageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },

  date: {
    type: String,
    required: true
  },

  count: {
    type: Number,
    default: 0
  }
});

export default mongoose.models.Usage ||
  mongoose.model("Usage", UsageSchema);