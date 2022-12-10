import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

let result

for (let i = 0; i < inputText.length - 4; i += 1) {
  const potentialMarker = inputText.substring(i, i + 4);
  
  if (new Set(potentialMarker.split('')).size === 4) {
    // we found it
    result = i + 4
    break;
  }
}

console.log(result);