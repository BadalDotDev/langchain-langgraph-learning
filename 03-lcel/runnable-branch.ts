import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnableBranch } from "@langchain/core/runnables";

// LLM setup
const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

// Prompt for technical questions
const technicalPrompt = PromptTemplate.fromTemplate(
  "Answer this technical question clearly: {question}",
);

// Prompt for general questions
const generalPrompt = PromptTemplate.fromTemplate(
  "Answer this general question simply: {question}",
);

// Create separate chains
const technicalChain = RunnableSequence.from([technicalPrompt, model]);

const generalChain = RunnableSequence.from([generalPrompt, model]);

// RunnableBranch chooses which chain to run
const branchChain = RunnableBranch.from([
  [
    (input) =>
      input.question.toLowerCase().includes("javascript") ||
      input.question.toLowerCase().includes("api") ||
      input.question.toLowerCase().includes("database"),

    technicalChain,
  ],

  // Default fallback chain
  generalChain,
]);

async function main() {
  // Example 1: Technical question
  const result1 = await branchChain.invoke({
    question: "What is JavaScript closure?",
  });

  console.log("Technical Question Output:\n");
  console.log(result1.content);

  // Example 2: General question
  const result2 = await branchChain.invoke({
    question: "Why is the sky blue?",
  });

  console.log("\nGeneral Question Output:\n");
  console.log(result2.content);
}

main();
