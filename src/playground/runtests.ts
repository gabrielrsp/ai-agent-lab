import { runTests } from "../tools/testTools/runTests";

const result = runTests({
    command: "npm test",
    cwd: "/Users/gabriel/projetos/dws-blog",
  });

console.log(
  JSON.stringify(result, null, 2)
);