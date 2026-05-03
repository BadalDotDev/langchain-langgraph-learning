import "dotenv/config";

import { ChatGroq } from "@langchain/groq";
import * as readline from "readline";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chat() {
  rl.question("\nYou: ", async (input) => {
    if (input === "exit") {
      rl.close();
      return;
    }

    process.stdout.write("\nAI: ");

    const stream = await model.stream(input);

    for await (const chunk of stream) {
      process.stdout.write(chunk.content as string);
    }

    console.log("\n");

    chat();
  });
}

chat();
