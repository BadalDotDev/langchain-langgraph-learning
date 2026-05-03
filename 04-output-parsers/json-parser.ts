import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { JsonOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const parser = new JsonOutputParser();

const prompt = ChatPromptTemplate.fromTemplate(`
Return ONLY valid JSON.

Topic: {topic}

Format:
{{
  "summary": "string",
  "difficulty": "easy|medium|hard"
}}
`);

const chain = prompt.pipe(model).pipe(parser);

async function main() {
  const response = await chain.invoke({
    topic: "LangGraph",
  });

  console.log(response);
}

main();
