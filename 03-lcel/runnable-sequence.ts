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
  const result = await jokeChain.invoke({
    topic: "programming",
  });

  console.log("RunnableSequence Output:\n");
  console.log(result.content);
}

async function main() {
  await sequenceExample();
}

main();
