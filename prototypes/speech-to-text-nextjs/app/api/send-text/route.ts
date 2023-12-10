import fs from "node:fs";
import lunr from "lunr";
import { NextResponse } from "next/server";

let textLines: string[];
try {
  const data = fs.readFileSync("../../text/beer_es.txt", "utf8");
  console.log(data.length);
  textLines = data.split("\n");
  console.log(textLines.length, "lines of text");
} catch (err) {
  console.error(err);
  process.exit(-1);
}

const idx = lunr(function () {
  this.field("line");

  textLines.forEach((line, idx) => {
    this.add({ line: line, id: idx });
  });
});
console.log("Index created");

export async function POST(request: Request) {
  const { text } = await request.json();
  console.log("Received", text);

  if (text) {
    const res = idx.search(text);

    if (res && res.length && res.length > 0) {
      const line = parseInt(res[0].ref);
      console.log(`Match found in line ${line + 1}'`);
    } else {
      console.log("Match not found.");
    }
  }

  return NextResponse.json("", { status: 200, statusText: "OK" });
}
