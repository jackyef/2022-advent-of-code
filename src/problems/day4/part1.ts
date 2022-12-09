import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const pairs = inputText.split("\n");
let totalFullyOverlappingAssignmentCount = 0;

pairs.forEach((pair) => {
  const [firstRange, secondRange] = pair.split(",");
  const [firstStart, firstEnd] = firstRange
    .split("-")
    .map(Number);
  const [secondStart, secondEnd] = secondRange
    .split("-")
    .map(Number);

  const firstRangeStartsEarlier = firstStart <= secondStart;
  const firstRangeEndsLater = firstEnd >= secondEnd;
  const secondRangeStartsEarlier =
    secondStart <= firstStart;
  const secondRangeEndsLater = secondEnd >= firstEnd;

  const firstRangeCoverage = firstEnd - firstStart;
  const secondRangeCoverage = secondEnd - secondStart;
  const startingPointDifference = Math.abs(
    firstStart - secondStart
  );

  const isFullyOverlapping = (() => {
    if (firstRangeStartsEarlier && firstRangeEndsLater) {
      return (
        firstRangeCoverage >=
        startingPointDifference + secondRangeCoverage
      );
    }

    if (secondRangeStartsEarlier && secondRangeEndsLater) {
      return (
        secondRangeCoverage >=
        startingPointDifference + firstRangeCoverage
      );
    }

    return false;
  })();

  if (isFullyOverlapping) {
    totalFullyOverlappingAssignmentCount += 1;
  }
});

console.log({ totalFullyOverlappingAssignmentCount });
