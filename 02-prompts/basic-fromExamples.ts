import { PromptTemplate } from "@langchain/core/prompts";

const examples = ["Input: happy\nOutput: sad", "Input: tall\nOutput: short"];
const prefix = "\nGive the opposite word.\n";
const suffix = "Input: {word}\nOutput:";
const inputVariables = ["word"];

{
  /* 
    Use this when you want to build a prompt using:
        multiple examples
        prefix
        suffix
    This is commonly used for few-shot prompting. 
*/
}
const promptWithExamples = PromptTemplate.fromExamples(
  examples,
  suffix,
  inputVariables,
  prefix,
);

const formatted = await promptWithExamples.format({
  word: "virtue",
});
const invoked = await promptWithExamples.invoke({
  word: "virtue",
});

console.log(formatted);
console.log(invoked);
