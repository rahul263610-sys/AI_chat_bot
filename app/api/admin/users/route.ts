import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { authorizeRole } from "@/lib/auth";
export async function GET() {
  try {
    await connectDB();
    const auth = await authorizeRole(["Admin"]);
    if ("error" in auth) return auth.error;
    
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name role createdAt")
      .lean()
      .populate({
        path: "subscription",
        select: "plan -_id",
      });

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load users" }, { status: 500 });
  }
}
