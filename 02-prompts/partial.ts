import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(
  `
    You are a {role}.

    Explain {topic}
    `,
);

const partialPrompt = await prompt.partial({
  role: "senior backend engineer",
});

const final = await partialPrompt.format({
  topic: "Redis",
});

console.log(final);
