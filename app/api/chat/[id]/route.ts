import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { authorizeRole, getCurrentUserDetails } from "@/lib/auth";
import { checkAndIncrementUsage, checkUsage } from "@/lib/checkUsage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await authorizeRole(["Admin", "User"]);
    if ("error" in auth) return auth.error;
    const usageCheck = await checkUsage(auth.user.id);
    const { id } = await params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid chat id" },
        { status: 400 }
      );
    }
    const chat = await Chat.findById(id);

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({chat, usageCheck});
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}


export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // const auth = await authorizeRole(["Admin", "User"]);
    //   if ("error" in auth) return auth.error;
    const { id } = await context.params;
    const user= await getCurrentUserDetails();
    if (!user || !user._id) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const usageCheck = await checkAndIncrementUsage(user._id);
    if (!usageCheck.allowed) {
      return Response.json({
        usageCheck,
      }, { status: 403 });
    }
    usageCheck.remaining--;
    const { message } = await req.json();
    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }
    chat.messages.push({ role: "user", content: message });
    if (chat.messages.length === 1) {
      chat.title = message;
    }
    const msg = message
      .replace(/\n/g, " ")
      .replace(/\t/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return await new Promise<NextResponse>((resolve) => {
      const child = spawn(
        `openclaw agent --agent main --message "${msg.replace(/"/g, '\\"')}"`,
        { shell: true }
      );

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", async (code) => {
        if (code !== 0) {
          resolve(
            NextResponse.json(
              { error: stderr || `Process exited with code ${code}` },
              { status: 500 }
            )
          );
          return;
        }
        chat.messages.push({ role: "assistant", content: stdout.trim() });
        await chat.save();

      resolve(
        NextResponse.json({
          response: stdout.trim(),
          chat,
          usageCheck
        })
      );

      });

      child.on("error", (err) => {
        resolve(
          NextResponse.json({ error: err.message }, { status: 500 })
        );
      });
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
