import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import User from "@/models/User";
import type { AuthUser, Role, User as UserType } from "@/types/user";

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    const p = payload as Record<string, any> | undefined;
    if (!p) return null;

    const id = typeof p.id === "string" ? p.id : String(p.id ?? "");
    const role = p.role as Role | undefined;
    if (!id || (role !== "Admin" && role !== "User")) return null;

    const user: AuthUser = { id, role };
    return user;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUserDetails(): Promise<UserType | null> {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return null;

    const user = await User.findById(authUser.id).select("-password").lean();
    return user ? { ...user, _id: user._id.toString() } : null;
  } catch (error) {
    return null;
  }
}

export async function authorizeRole(
  allowedRoles: Role[]
) {
  const user = await getAuthUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return { user };
}
