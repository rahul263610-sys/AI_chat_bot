import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { authorizeRole } from "@/lib/auth";

export async function POST() {
  try {
    await connectDB();

    const auth = await authorizeRole(["Admin", "User"]);
    if ("error" in auth) return auth.error;

    const newChat = await Chat.create({
      userId: auth.user.id,
      title: "New Chat",
      messages: [],
    });

    return NextResponse.json(newChat, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create chat" },
      { status: 500 }
    );
  }
}
