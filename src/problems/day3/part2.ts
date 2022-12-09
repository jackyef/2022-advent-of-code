import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const rucksacks = inputText.split("\n");
const groups = [];
let totalPriority = 0;

for (let i = 0; i < rucksacks.length; i += 3) {
  groups.push([
    rucksacks[i],
    rucksacks[i + 1],
    rucksacks[i + 2],
  ]);
}

const isUpperCase = (char: string) => {
  return char === char.toUpperCase();
};

const calculatePriorityForCharacter = (char: string) => {
  // 'a' charCode is 97.
  // Priority for 'a' to 'z' is 1 to 26
  // 'A' charCode is 65.
  // So we can calculate it easily by subtracting 96

  if (isUpperCase(char)) {
    return char.charCodeAt(0) - 64 + 26;
  }

  return char.charCodeAt(0) - 96;
};

groups.forEach((group) => {
  const rucksackA = group[0].split("");
  const rucksackB = group[1].split("");
  const rucksackC = group[2].split("");

  let wronglyPackedItem = null

  for (let i = 0; i < rucksackA.length; i++) {
    wronglyPackedItem =
      rucksackB.find((v) => v === rucksackA[i]) &&
      rucksackC.find((v) => v === rucksackA[i]);

    if (wronglyPackedItem) break;
  }

  if (wronglyPackedItem) {
    totalPriority += calculatePriorityForCharacter(wronglyPackedItem);
  }
});

console.log({ totalPriority });
