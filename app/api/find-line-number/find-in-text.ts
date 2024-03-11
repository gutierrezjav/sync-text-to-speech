import Fuse, { FuseResult } from "fuse.js";
import lunr from "lunr";
import fs from "node:fs";
import path from "path";

// export const findInText = (
//   text: string,
//   fromLine: number = 0,
//   maxDistance: number = 25
// ) => {
//   const idx = new Fuse(textLines.slice(fromLine, fromLine + maxDistance), {
//     includeScore: true,
//     isCaseSensitive: false,
//     minMatchCharLength: 5,
//     ignoreLocation: true,
//   });
//   console.log("Index created");

//   const res = idx.search(text);

//   if (res && res.length && res.length > 0) {
//     res
//       .filter((r, i) => i < 5)
//       .forEach((r) =>
//         console.log(
//           `Match found in line ${r.refIndex + fromLine}, (${r.score}): ${r.item}`
//         )
//       );
//     const line = res[0].refIndex + fromLine;

//     return line;
//   } else {
//     console.log("Match not found.");
//     return -1;
//   }
// };

export class TextSearch {
  private initialized = false;
  private textLines!: string[];

  constructor(private engine: "lunr" | "fuse") {}

  public findInText = (
    text: string,
    fromLine: number = 0,
    maxDistance: number = 25
  ) => {
    if (!this.initialized) {
      this.initialize();
    }
    // go back a few lines, just in case
    fromLine -= 3;
    // make sure we didn't go too far
    if (fromLine < 0) {
      fromLine = 0;
    }
    // create the index with the most likely lines of text only
    const idx = this.createIndex(fromLine, maxDistance);
    console.log("Index created");

    const res = idx.search(text);

    if (res && res.length && res.length > 0) {
      res
        .filter((r, i) => i < 5)
        .forEach((r) => {
          const num = this.getRefIndex(r) + fromLine;
          const score = r.score?.toFixed(2);
          const text = this.textLines[this.getRefIndex(r)];
          console.log(`Match found in line ${num}, score ${score}. \n${text}`);
        });
      const line = this.getRefIndex(res[0]) + fromLine;

      return line;
    } else {
      console.log("Match not found.");
      return -1;
    }
  };

  private createIndex = (fromLine: number = 0, maxDistance: number = 25) => {
    const linesToIndex = this.textLines.slice(fromLine, fromLine + maxDistance);
    if (this.engine === "fuse") {
      return new Fuse(linesToIndex, {
        includeScore: true,
        isCaseSensitive: false,
        minMatchCharLength: 5,
        ignoreLocation: true,
      });
    } else {
      return lunr(function () {
        this.field("line");
        linesToIndex.forEach((line, idx) => {
          this.add({ line: line, id: idx });
        });
      });
    }
  };

  private getRefIndex = (r: FuseResult<string> | lunr.Index.Result) =>
    "refIndex" in r ? r.refIndex : parseInt(r.ref);

  private initialize = () => {
    try {
      const filePath = path.join(process.cwd(), "public/text/beer_es.txt");
      console.log("Initializing from path", filePath);
      const data = fs.readFileSync(filePath, "utf8");
      console.log(data.length);
      this.textLines = data.split("\n");
      console.log(this.textLines.length, "lines of text");
      this.initialized = true;
    } catch (err) {
      console.error(err);
      process.exit(-1);
    }
  };
}
