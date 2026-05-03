import "dotenv/config";

import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatGroq } from "@langchain/groq";

const uppercase = RunnableLambda.from((input: string) => {
  return input.toUpperCase();
});

const prompt = PromptTemplate.fromTemplate("What is the capital of {country}?");

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});
const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser).pipe(uppercase);

async function main() {
  const response = await chain.invoke({
    country: "India",
  });
  console.log(response);
}

main();
