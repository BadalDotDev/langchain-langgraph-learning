import { config } from "dotenv";

config();

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

async function main() {
  const response = await model.invoke("Explain LangChain in one paragraph");

  console.log(response);
}

main();
