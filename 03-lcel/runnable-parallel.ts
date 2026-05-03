import "dotenv/config";

import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnableParallel } from "@langchain/core/runnables";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

// Joke prompt chain
const jokePrompt = PromptTemplate.fromTemplate(
  "Write a short funny joke about {topic}",
);

const jokeChain = RunnableSequence.from([jokePrompt, model]);

// Poem prompt chain
const poemPrompt = PromptTemplate.fromTemplate(
  "Write a short 4-line poem about {topic}",
);

const poemChain = RunnableSequence.from([poemPrompt, model]);

// Run both chains in parallel
const parallel = RunnableParallel.from({
  joke: jokeChain,
  poem: poemChain,
});

async function main() {
  const results = await parallel.invoke({
    topic: "cats",
  });

  console.log("Joke:\n", results.joke.content);
  console.log("\nPoem:\n", results.poem.content);
}

main();
