import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { authorizeRole } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const auth = await authorizeRole(["Admin"]);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const chats = await Chat.find({ userId: id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(chats, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
