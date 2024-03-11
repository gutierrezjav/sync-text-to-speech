import { getLineNumber } from "@/app/utils/db-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_: Request) {
  const lineNumber = await getLineNumber();
  return NextResponse.json({ lineNumber });
}
