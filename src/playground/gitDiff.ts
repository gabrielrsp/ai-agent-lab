import "dotenv/config";

import { readGitDiff } from "../tools/contextTools/readGitDiff";

const result = readGitDiff();

console.log(JSON.stringify(result, null, 2));