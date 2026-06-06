import "dotenv/config";

import {
  generateEmbedding,
} from "./services/embeddingService.js";

async function main() {
  const embedding =
    await generateEmbedding(
      "React hooks help manage state."
    );

  console.log(
    "Embedding length:",
    embedding?.length
  );

  console.log(
    embedding?.slice(0, 10)
  );
}

main();