import "dotenv/config";

import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

async function main() {
  const messages = [
    new SystemMessage(`
      You are an expert AI fitness coach.
      Give practical workout and diet advice.
      Be motivating and concise.
    `),

    new HumanMessage("I want to lose belly fat in 3 months."),
  ];

  const response = await model.invoke(messages);

  console.log("\nAI Coach:\n");
  console.log(response.content);
}

main();
