import "dotenv/config";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  new MessagesPlaceholder("history"), // NOTE: Doesn't work with .fromTemplate()
  ["human", "{question}"],
]);

const result = await prompt.invoke({
  history: [
    ["human", "My name is Badal"],
    ["ai", "Nice to meet you, Badal!"],
  ],
  question: "What is my name?",
});

console.log(result.toString());

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const response = await model.invoke(result);

console.log(response.content);
