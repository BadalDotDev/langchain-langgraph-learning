import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { StructuredOutputParser } from "@langchain/core/output_parsers";

import { z } from "zod";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    concept: z.string(),
    difficulty: z.string(),
    examples: z.array(z.string()),
  }),
);

const prompt = ChatPromptTemplate.fromTemplate(`
Explain {topic}

{format_instructions}
`);

const chain = prompt.pipe(model).pipe(parser);

async function main() {
  const response = await chain.invoke({
    topic: "closures",

    format_instructions: parser.getFormatInstructions(),
  });

  console.log(response);
}

main();
