import "dotenv/config";

import { readGitDiff } from "../tools/contextTools/readGitDiff";
import { buildGitDiffContexts } from "../context/buildGitDiffContexts";


const gitDiff = readGitDiff();

const contexts =
  buildGitDiffContexts(
    gitDiff.changedFiles
  );

console.log(
  JSON.stringify(
    contexts,
    null,
    2
  )
);