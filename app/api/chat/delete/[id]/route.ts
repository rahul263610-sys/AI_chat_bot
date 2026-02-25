import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const chat = await Chat.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json(
        { message: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Chat deleted successfully",
      chat,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}