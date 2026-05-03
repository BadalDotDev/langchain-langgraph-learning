import "dotenv/config";

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

// Extraction schema
const userSchema = z.object({
  name: z.string().describe("Person name"),
  company: z.string().describe("Company name"),
  role: z.string().describe("Job role"),
});

const structuredModel = model.withStructuredOutput(userSchema);

const prompt = ChatPromptTemplate.fromTemplate(`
Extract the following details from the text:

1. name
2. company
3. role

Text:
{text}
`);

const chain = prompt.pipe(structuredModel);

async function main() {
  const response = await chain.invoke({
    text: "Hi, I am John Smith and I work as a Senior Backend Developer at Google.",
  });

  console.log(response);
}

main();
