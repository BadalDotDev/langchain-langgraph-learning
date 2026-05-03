import "dotenv/config";

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

// Schema using z.enum()
const sentimentSchema = z.object({
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .describe("Sentiment of the given text"),
});

const structuredModel = model.withStructuredOutput(sentimentSchema);

const prompt = ChatPromptTemplate.fromTemplate(`
Classify the sentiment of the following text:

Text: {text}
`);

const chain = prompt.pipe(structuredModel);

async function main() {
  const response = await chain.invoke({
    text: "This course is amazing and very easy to understand!",
  });

  console.log(response);
}

main();
