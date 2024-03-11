import { kv } from "@vercel/kv";

export const getLineNumber = async () => {
  const lineNumber = await kv.get<number>("lineNumber");
  console.log("Read database", lineNumber);
  return lineNumber ?? -1;
};

export const saveLineNumber = async (line: number) => {
  return kv.set("lineNumber", line);
};
