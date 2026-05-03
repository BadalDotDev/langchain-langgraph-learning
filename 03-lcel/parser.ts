import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const prompt = ChatPromptTemplate.fromTemplate(
  "Explain {topic} in simple terms",
);

const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);

async function main() {
  const response = await chain.invoke({
    topic: "event loop",
  });

  console.log(response);
}

main();
