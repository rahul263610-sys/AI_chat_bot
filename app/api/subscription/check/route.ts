import { NextResponse } from "next/server";
import { getUserSubscription } from "@/lib/getUserSubscription";

export async function GET() {
  const result = await getUserSubscription();

  if ("error" in result) {
    return NextResponse.json(
      { message: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json(result.subscription);
}