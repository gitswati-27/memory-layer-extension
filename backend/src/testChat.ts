import "dotenv/config";

import {
  askGroq,
} from "./services/chatService.js";

async function main() {
  const response =
    await askGroq(
      "What is React?",
      `
React is a JavaScript library
for building user interfaces.
`
    );

  console.log(response);
}

main();