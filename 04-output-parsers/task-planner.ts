import "dotenv/config";

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

// Task planner schema
const plannerSchema = z.object({
  steps: z
    .array(z.string())
    .describe("List of steps required to complete the task"),

  estimatedTime: z.string().describe("Estimated total completion time"),

  difficulty: z
    .enum(["easy", "medium", "hard"])
    .describe("Task difficulty level"),
});

const structuredModel = model.withStructuredOutput(plannerSchema);

const prompt = ChatPromptTemplate.fromTemplate(`
Create a task execution plan for:

Task: {task}
`);

const chain = prompt.pipe(structuredModel);

async function main() {
  const response = await chain.invoke({
    task: "Build a REST API using Node.js and Express",
  });

  console.log(response);
}

main();
