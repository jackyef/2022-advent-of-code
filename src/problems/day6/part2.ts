import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

let result

for (let i = 0; i < inputText.length - 14; i += 1) {
  const potentialMarker = inputText.substring(i, i + 14);

  if (new Set(potentialMarker.split('')).size === 14) {
    // we found it
    result = i + 14
    break;
  }
}

console.log(result);