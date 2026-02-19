import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { authorizeRole } from "@/lib/auth";

// GET chat by id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Authorize Admin or User
    await connectDB();
    const auth = await authorizeRole(["Admin", "User"]);
    if ("error" in auth) return auth.error;


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

    return NextResponse.json(chat);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// POST chat message
// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { id } = await params;
//     const { message } = await req.json();

//     const chat = await Chat.findById(id);
//     if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

//     chat.messages.push({ role: "user", content: message });
//     if (chat.messages.length === 1) chat.title = message;

//     const msg = message.replace(/\n|\t|\s+/g, " ").trim();

//     return await new Promise<NextResponse>((resolve) => {
//       const child = spawn(
//         `openclaw agent --agent main --message "${msg.replace(/"/g, '\\"')}"`,
//         { shell: true }
//       );

//       let stdout = "";
//       let stderr = "";

//       child.stdout.on("data", (data) => (stdout += data.toString()));
//       child.stderr.on("data", (data) => (stderr += data.toString()));

//       // Add timeout to prevent hanging
//       const timeout = setTimeout(() => {
//         child.kill();
//         chat.messages.push({
//           role: "assistant",
//           content: "Response timeout. Please try again.",
//         });
//         chat.save().then(() => {
//           resolve(
//             NextResponse.json({
//               response: "Response timeout. Please try again.",
//               chat,
//             })
//           );
//         });
//       }, 10000); // 10 second timeout

//       child.on("close", async (code) => {
//         clearTimeout(timeout);

//         if (code !== 0) {
//           // If openclaw fails, add a fallback response
//           const fallbackResponse = `I encountered an error processing your request. Please try again. (Error: ${stderr || `Exit code ${code}`})`;
//           chat.messages.push({ role: "assistant", content: fallbackResponse });
//           await chat.save();
//           resolve(NextResponse.json({ response: fallbackResponse, chat }));
//           return;
//         }

//         chat.messages.push({ role: "assistant", content: stdout.trim() });
//         await chat.save();

//         resolve(NextResponse.json({ response: stdout.trim(), chat }));
//       });

//       child.on("error", (err) => {
//         clearTimeout(timeout);
//         const fallbackResponse = `Error: ${err.message}`;
//         chat.messages.push({ role: "assistant", content: fallbackResponse });
//         chat.save().then(() => {
//           resolve(NextResponse.json({ response: fallbackResponse, chat }));
//         });
//       });
//     });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await authorizeRole(["Admin", "User"]);
      if ("error" in auth) return auth.error;
    const { id } = await context.params;
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
