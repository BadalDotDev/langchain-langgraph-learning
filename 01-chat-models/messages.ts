import "dotenv/config";

import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

async function main() {
  const systemMessage = new SystemMessage(
    "You are a helpful assistant that answers questions about world capitals.",
  );
  const userMessage = new HumanMessage("What is the capital of France?");

  const response = await model.invoke([systemMessage, userMessage]);

  console.log(response.content);
}

main();
