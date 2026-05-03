import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 2,
});

const response = await model.invoke("Give a sad quote.");

console.log(response.content);
