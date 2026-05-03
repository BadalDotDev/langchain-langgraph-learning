import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

const examples = [
  {
    question: "2+2",
    answer: "4",
  },
  {
    question: "3+3",
    answer: "6",
  },
];

const examplePrompt = PromptTemplate.fromTemplate(
  "Question: {question}\nAnswer: {answer}",
);

const prompt = new FewShotPromptTemplate({
  examples,
  examplePrompt,

  suffix: "Question: {input}",

  inputVariables: ["input"],
});

const result = await prompt.format({
  input: "4+4",
});

console.log(result);
