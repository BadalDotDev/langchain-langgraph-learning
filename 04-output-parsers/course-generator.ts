import "dotenv/config";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const courseSchema = z.object({
  title: z.string().describe("The title of the course"),
  duration: z
    .string()
    .describe("The estimated time to complete the course, e.g., '2 hours'"),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const structuredModel = model.withStructuredOutput(courseSchema);

const prompt = PromptTemplate.fromTemplate("Generate a course for {topic}");

const chain = prompt.pipe(structuredModel);

const result = await chain.invoke({
  topic: "LangChain",
});

console.log(result);
