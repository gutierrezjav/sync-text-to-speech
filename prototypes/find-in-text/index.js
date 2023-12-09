const fs = require("node:fs");
let textLines;
try {
  const data = fs.readFileSync("../text/beer_en.txt", "utf8");
  console.log(data.length);
  textLines = data.split("\n");
  console.log(textLines.length, "lines of text");
} catch (err) {
  console.error(err);
  process.exit(-1);
}

const lunr = require("lunr");

const idx = lunr(function () {
  this.field("line");

  textLines.forEach((line, idx) => {
    this.add({ line: line, id: idx });
  });
});
console.log("Index created");

const searchTerm =
  "when the following conditions exist alcoholism is said to happen"; // 414
// const searchTerm = "alcoholism is said to happen when the following conditions exist"; // 414
// const searchTerm = "increases sales of their product"; //353
//const searchTerm ="drink in the oriental part of the Himalaya mountains and also in China"; // 398 and 399

console.log("");
console.log(`Searching for: '${searchTerm}'`);
const res = idx.search(searchTerm);
console.log(
  "Top 5 search results scores",
  res.slice(0, 5).map((r) => {
    return { line: 1 + parseInt(r.ref), score: r.score };
  })
);
console.log("");

const line = parseInt(res[0].ref);
console.log(`Match found in line ${line + 1}: '${textLines[line]}'`);
