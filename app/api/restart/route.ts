import { getLineNumber, saveLineNumber } from "@/app/utils/db-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_: Request) {
  await saveLineNumber(-1);
  return NextResponse.json({ result: "ok" });
}
