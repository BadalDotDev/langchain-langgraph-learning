import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

async function main() {
  const stream = await model.stream("Write a short 2-line poem about AI");

  for await (const chunk of stream) {
    process.stdout.write(chunk.content as string);
  }
}

main();
