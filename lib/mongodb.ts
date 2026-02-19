import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI");
}

let cached: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } = 
  (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) return cached.conn; 

    if (!cached.promise) {
        if (!MONGO_URI) {
            throw new Error("Please define MONGO_URI");
        }
        cached.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => mongooseInstance);
    }

  cached.conn = await cached.promise;
  return cached.conn;
}
