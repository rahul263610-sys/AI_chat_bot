import { NextResponse,NextRequest } from "next/server";
import { getCurrentUserDetails } from "@/lib/auth";
import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import { authorizeRole } from "@/lib/auth";
export async function GET() {
  const auth = await authorizeRole(["Admin", "User"]);
  if ("error" in auth) return auth.error;
  
  const user = await getCurrentUserDetails();

  if (!user) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const auth = await authorizeRole(["Admin", "User"]);
    if ("error" in auth) return auth.error;

    const currentUser = await getCurrentUserDetails();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { name, email },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update Error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}