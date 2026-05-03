import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

// LLM setup
const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

// Prompt for joke generation
const jokePrompt = PromptTemplate.fromTemplate(
  "Write a short funny joke about {topic}",
);

// RunnableSequence executes steps one after another
const jokeChain = RunnableSequence.from([jokePrompt, model]);

async function sequenceExample() {
  const batchResult = await jokeChain.batch([
    { topic: "programming" },
    { topic: "cats" },
    { topic: "space" },
  ]);
  console.log("\nRunnableSequence Batch Output:\n");
  batchResult.forEach((res, idx) => {
    console.log(`Example ${idx + 1}:\n${res.content}\n`);
  });
}

async function main() {
  await sequenceExample();
}

main();
