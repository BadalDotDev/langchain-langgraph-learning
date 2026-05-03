import { ChatPromptTemplate } from "@langchain/core/prompts";

{
  /*
    .fromTemplate() is used when you have a single prompt string with variables.
     - If you have multiple examples, use .fromExamples()
  */
}
const chatPromptTemplate = ChatPromptTemplate.fromTemplate(
  "Explain {topic} in simple terms",
);

console.log("ChatPromptTemplate", chatPromptTemplate);

const formatted = await chatPromptTemplate.format({
  topic: "JavaScript closures",
});
console.log("Formatted", formatted);

const invoked = await chatPromptTemplate.invoke({
  topic: "JavaScript closures",
});
console.log("Invoked", invoked);
