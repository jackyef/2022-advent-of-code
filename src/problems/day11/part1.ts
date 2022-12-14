import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

type Monkey = {
  items: number[];
  makeHumanWorry: (prevWorryLevel: number) => number;
  decideMonkeyToThrowTo: (worryLevel: number) => number;
  totalItemsInspected: number
};

const monkeys: Record<string, Monkey> = {};
const parseMonkey = (monkeyString: string): Monkey => {
  // Monkey 0:
  // Starting items: 66, 59, 64, 51
  // Operation: new = old * 3
  // Test: divisible by 2
  //   If true: throw to monkey 1
  //   If false: throw to monkey 4

  const lines = monkeyString.split("\n");

  return {
    items: lines[1].trim()
      .replace("Starting items: ", "")
      .split(", ")
      .map(Number),
    makeHumanWorry: (() => {
      const formulaString = lines[2].trim().replace("Operation: new = ", "")

      return (prevWorryLevel: number) => {
        return eval(`var old = ${prevWorryLevel}; ${formulaString};`)
      }
    })(),
    decideMonkeyToThrowTo: (() => {
      const testDivisibilityNumber = lines[3].trim().replace("Test: divisible by ", "")

      return (worryLevel: number) => {
        if (worryLevel % Number(testDivisibilityNumber) === 0) {
          return Number(lines[4][lines[4].length - 1])
        } else {
          return Number(lines[5][lines[5].length - 1])
        }
      }
    })(),
    totalItemsInspected: 0,
  };
};

const monkeyStrings = inputText.split("\n\n");

monkeyStrings.forEach((monkeyString, index) => {
  monkeys[index] = parseMonkey(monkeyString);
});

let currentRound = 1;

while (currentRound <= 20) {
  for (const [index, monkey] of Object.entries(monkeys)) {
    let item
    while (item = monkey.items.shift()) {
      let worryLevel = monkey.makeHumanWorry(item)
      monkey.totalItemsInspected += 1;

      // monkey gets bored
      worryLevel = Math.floor(worryLevel / 3)

      monkeys[monkey.decideMonkeyToThrowTo(worryLevel)].items.push(worryLevel)
    }
  }

  currentRound += 1;
}

const getTopTwoMonkeys = () => {
  let topMonkeyCount = 0;
  let secondMonkeyCount = 0;

  for (const [_, monkey] of Object.entries(monkeys)) {
    if (monkey.totalItemsInspected > topMonkeyCount) {
      secondMonkeyCount = topMonkeyCount;
      topMonkeyCount = monkey.totalItemsInspected;
    } else if (monkey.totalItemsInspected > secondMonkeyCount) {
      secondMonkeyCount = monkey.totalItemsInspected;
    }
  }

  return [topMonkeyCount, secondMonkeyCount]
}

const [topMonkey, secondMonkey] = getTopTwoMonkeys()
console.log(topMonkey * secondMonkey)