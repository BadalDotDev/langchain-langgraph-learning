import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

async function main() {
  const response = await model.batch([
    "What is the largest planet in the solar system?",
    "What is the solution to the equation 2x + 3 = 7?",
  ]);

  console.log(response);
}

main();
