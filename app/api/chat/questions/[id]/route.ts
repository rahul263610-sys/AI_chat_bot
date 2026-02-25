import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { authorizeRole } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const auth = await authorizeRole(["Admin"]);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const chat = await Chat.findById(id).lean();
  
  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const userMessages = chat.messages.filter(
    (msg: any) => msg.role === "user"
  );

  return NextResponse.json({
    title: chat.title,
    questions: userMessages,
  });
}
