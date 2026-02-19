import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Chat from "@/models/Chat";
import { authorizeRole } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const auth = await authorizeRole(["Admin"]);
      if ("error" in auth) return auth.error;
    
    const totalUsers = await User.countDocuments();
    const totalChats = await Chat.countDocuments();

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const chatsToday = await Chat.countDocuments({ createdAt: { $gte: yesterday } });
    const newSignups24h = await User.countDocuments({ createdAt: { $gte: yesterday } });

    // signups by day for last 7 days
    const signupsByDay: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(now.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const count = await User.countDocuments({ createdAt: { $gte: dayStart, $lt: dayEnd } });
      signupsByDay.push({ date: dayStart.toISOString().slice(0, 10), count });
    }

    return NextResponse.json({
      totalUsers,
      totalChats,
      chatsToday,
      newSignups24h,
      signupsByDay,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load stats" }, { status: 500 });
  }
}
