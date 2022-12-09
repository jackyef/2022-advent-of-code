import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const rucksacks = inputText.split("\n");
let totalPriority = 0


const isUpperCase = (char: string) => {
    return char === char.toUpperCase()
}

const calculatePriorityForCharacter = (char: string) => {
  // 'a' charCode is 97. 
  // Priority for 'a' to 'z' is 1 to 26
  // 'A' charCode is 65.
  // So we can calculate it easily by subtracting 96

  if (isUpperCase(char)) {
    return char.charCodeAt(0) - 64 + 26
  }

  return char.charCodeAt(0) - 96
}

rucksacks.forEach((r) => {
  const itemCount = r.length / 2;
  const compartmentA = r.slice(0, itemCount).split("");
  const compartmentB = r.slice(itemCount).split("");

  let wronglyPackedItem = null;
  for (let i = 0; i < compartmentA.length; i++) {
    wronglyPackedItem = compartmentB.find(
      (v) => v === compartmentA[i]
    );

    if (wronglyPackedItem) break;
  }

  if (wronglyPackedItem) {
    totalPriority += calculatePriorityForCharacter(wronglyPackedItem)
  }
});

console.log({ totalPriority })