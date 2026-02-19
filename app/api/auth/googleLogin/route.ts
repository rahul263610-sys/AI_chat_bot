import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const token = Jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const response = NextResponse.redirect(
    new URL(
      user.role === "Admin" ? "/admin/dashboard" : "/chat",
      req.url
    )
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
