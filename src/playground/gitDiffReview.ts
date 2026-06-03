import "dotenv/config";

import { readGitDiff } from "../tools/contextTools/readGitDiff";
import { buildGitDiffContexts } from "../context/buildGitDiffContexts";
import { gitDiffReviewer } from "../agents/gitDiffReviewer";

async function main() {
  const gitDiff = readGitDiff();

  const contexts = buildGitDiffContexts(
    gitDiff.changedFiles
  );

  const review = await gitDiffReviewer({
    gitDiff,
    contexts,
  });

  console.log(JSON.stringify(review, null, 2));
}

main().catch(console.error);