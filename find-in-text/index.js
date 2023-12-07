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

// const searchTerm =  "alcoholism is said to happen when the following conditions exist"; // 414
// const searchTerm = "increases sales of their product"; //353
const searchTerm =
  "drink in the oriental part of the Himalaya mountains and also in China"; // 398 and 399

const res = idx.search(searchTerm)[0];
console.log("search results", JSON.stringify(res));

const line = parseInt(res.ref);
console.log(`Match found in line ${line + 1}`);
console.log(`Line 414: '${textLines[line]}'`);
