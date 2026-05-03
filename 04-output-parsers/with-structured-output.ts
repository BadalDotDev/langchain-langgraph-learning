import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { z } from "zod";

const schema = z.object({
  title: z.string(),
  summary: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
}).withStructuredOutput(schema);

async function main() {
  const response = await model.invoke("Explain React hooks");

  console.log(response);
}

main();
