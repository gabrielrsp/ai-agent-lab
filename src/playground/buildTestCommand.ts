import { buildTestCommand } from "../tools/testTools/buildTestCommand";

const result = buildTestCommand({
  testRunner: "vitest",
  testFilePath:
    "src/components/Button/Button.generated.test.tsx",
});

console.log(result);