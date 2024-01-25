import { DeepgramError, createClient } from "@deepgram/sdk";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const lineNumber = await getLineNumber();

  return NextResponse.json({ lineNumber });
}

async function getLineNumber() {
  const lineNumber = await kv.get<number>("lineNumber");
  console.log("Read database", lineNumber);
  return lineNumber ?? 0;
}
