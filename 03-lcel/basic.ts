import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const prompt = ChatPromptTemplate.fromTemplate("Explain {topic} simply");

const chain = prompt.pipe(model); // Create a chain by piping the prompt into the model

async function main() {
  const response = await chain.invoke({
    topic: "closures",
  });

  console.log(response.content);
}

main();
