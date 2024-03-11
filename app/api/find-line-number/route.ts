import { NextResponse } from "next/server";

import { getLineNumber, saveLineNumber } from "@/app/utils/db-utils";
import { TextSearch } from "./find-in-text";

const textSearch = new TextSearch("lunr");

export async function POST(request: Request) {
  const { text } = await request.json();
  console.log("Received", text);

  if (text) {
    const lastLineNumber = await getLineNumber();
    const lineNumber = textSearch.findInText(text, lastLineNumber);
    if (lineNumber >= 0) {
      saveLineNumber(lineNumber);
    }
  }

  return NextResponse.json("", { status: 200, statusText: "OK" });
}
