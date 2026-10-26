jest.mock("expo-file-system", () => ({ Directory: jest.fn(), File: jest.fn(), Paths: {} }));

import { pickEvictions } from "./imageCache";

test("pickEvictions", () => {
  const files = [
    { name: "new", size: 40, time: 3 },
    { name: "old", size: 30, time: 1 },
    { name: "mid", size: 50, time: 2 },
  ];
  // Under the limit: keep everything
  expect(pickEvictions(files, 200, 100)).toEqual([]);
  // Over (120 > 100): drop oldest first until at or under the target of 60
  expect(pickEvictions(files, 100, 60).map((f) => f.name)).toEqual(["old", "mid"]);
  // Dropping the oldest alone is enough when it gets under the target
  expect(pickEvictions(files, 100, 90).map((f) => f.name)).toEqual(["old"]);
});
