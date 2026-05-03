import { ChatPromptTemplate } from "@langchain/core/prompts";

{
  /*
   * .fromMessages() is used when you have a system prompt + user prompt.
   */
}

const chatPromptFromMessages = ChatPromptTemplate.fromMessages([
  {
    role: "system",
    content: "You are a helpful assistant that explains programming concepts.",
  },
  { role: "human", content: "Explain {topic} in simple terms" },
]);

const formattedFromMessages = await chatPromptFromMessages.format({
  topic: "JavaScript closures",
});
console.log("Formatted from messages", formattedFromMessages);

const invokedFromMessages = await chatPromptFromMessages.invoke({
  topic: "JavaScript closures",
});
console.log("Invoked from messages", invokedFromMessages);
