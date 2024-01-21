import { DeepgramError, createClient } from "@deepgram/sdk";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import fs from "node:fs";

export async function GET(request: Request) {
  const lineNumber = await getLineNumber();

  return NextResponse.json({ lineNumber });
}

async function getLineNumber() {
  const lineNumber = await kv.get<number>("lineNumber");

  // try {
  //   const data = fs.readFileSync("./app/api/lineNumber.json", "utf8");
  //   const json = JSON.parse(data);
  //   console.log("read json file", json);
  //   return json.lineNumber;
  // } catch (err) {
  //   console.error(err);
  // }
  return lineNumber ?? 0;
}
