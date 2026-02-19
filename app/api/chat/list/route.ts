import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { authorizeRole } from "@/lib/auth";

export async function GET(){
    await connectDB();
    const auth = await authorizeRole(["Admin", "User"]);
    const user = auth.user;
    if ("error" in auth) return auth.error;
    const chats = await Chat.find({ userId: user?.id }).sort({ updatedAt: -1 });
    return NextResponse.json(chats);
}