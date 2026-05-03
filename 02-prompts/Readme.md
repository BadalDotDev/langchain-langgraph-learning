# Chapter 02 — Prompt Templates

This chapter teaches how to build reusable, maintainable, and scalable prompts using LangChain Prompt Templates.

Instead of hardcoding prompts everywhere, you’ll learn modern prompt architecture used in production AI systems.

---

# What You'll Learn

In this chapter you’ll understand:

- `PromptTemplate`
- `ChatPromptTemplate`
- `MessagesPlaceholder`
- Partial variables
- Few-shot prompting
- Prompt composition
- XML prompting
- Prompt engineering principles
- Modern LangChain prompt workflows

---

# Why Prompt Templates Matter

Without prompt templates:

```ts
const prompt = `
You are a coding teacher.

Explain ${topic}
`;
```

This becomes:

- difficult to maintain
- hard to scale
- repetitive
- messy in large systems

Prompt Templates solve this by creating reusable and dynamic prompts.

---

# Main Prompt Types

| Type                     | Purpose                 |
| ------------------------ | ----------------------- |
| `PromptTemplate`         | String prompts          |
| `ChatPromptTemplate`     | Structured chat prompts |
| `MessagesPlaceholder`    | Dynamic chat history    |
| `FewShotPromptTemplate`  | Example-based prompting |
| `PipelinePromptTemplate` | Prompt composition      |

---

# Folder Structure

```txt
02-prompts/
 ├── src/
 │   ├── basic.ts
 │   ├── chat.ts
 │   ├── placeholders.ts
 │   ├── fewshot.ts
 │   ├── partial.ts
 │   └── xml.ts
```

---

# 1. PromptTemplate

Basic reusable string template.

---

## Example

```ts
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate("Explain {topic} in simple terms");

const formatted = await prompt.format({
  topic: "JavaScript closures",
});

console.log(formatted);
```

---

# Important Concept

```ts
prompt.format();
```

ONLY formats the prompt.

It does NOT call the model.

---

# Prompt + Model Example

```ts
import "dotenv/config";

import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const prompt = PromptTemplate.fromTemplate("Explain {topic} simply");

async function main() {
  const formattedPrompt = await prompt.format({
    topic: "event loop",
  });

  const response = await model.invoke(formattedPrompt);

  console.log(response.content);
}

main();
```

---

# 2. ChatPromptTemplate

Modern AI systems mostly use chat-based prompts.

---

## Example

```ts
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a senior JS teacher"],
  ["human", "Explain {topic}"],
]);
```

---

# Invoke a Prompt

Prompt templates are also runnables.

```ts
const messages = await prompt.invoke({
  topic: "promises",
});

console.log(messages);
```

---

# Full Chat Example

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert teacher"],
  ["human", "Explain {topic}"],
]);

async function main() {
  const formattedPrompt = await prompt.invoke({
    topic: "React hooks",
  });

  const response = await model.invoke(formattedPrompt);

  console.log(response.content);
}

main();
```

---

# Why ChatPromptTemplate is Important

It cleanly separates:

- system instructions
- user input
- examples
- placeholders
- memory/history

This becomes essential for:

- AI agents
- RAG systems
- chatbots
- conversational memory

---

# 3. MessagesPlaceholder

Used for:

- memory
- chat history
- dynamic message injection

---

## Example

```ts
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are helpful"],

  new MessagesPlaceholder("history"),

  ["human", "{question}"],
]);
```

---

## Using Placeholder

```ts
const formatted = await prompt.invoke({
  history: [
    ["human", "My name is Badal"],
    ["ai", "Nice to meet you!"],
  ],

  question: "What is my name?",
});
```

This is foundational for:

- conversational AI
- memory systems
- agents

---

# 4. Partial Variables

Pre-fill variables ahead of time.

---

## Example

```ts
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
```

---

# 5. Few-Shot Prompting

Teach the model using examples.

---

# Example Structure

```txt
Input → Example Outputs → New Input
```

---

# FewShotPromptTemplate

```ts
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
```

---

# Why Few-Shot Prompting Matters

Improves:

- formatting consistency
- reasoning
- extraction quality
- classification accuracy

Especially useful for smaller models.

---

# 6. Prompt Composition

Production AI systems build prompts modularly.

Example:

```txt
System Prompt
+ Context Prompt
+ Formatting Prompt
+ User Question
```

---

# 7. Prompt Engineering Principles

## Good Prompts

- clear
- specific
- structured
- constrained

---

## Bad Prompt

```txt
Tell me about coding
```

---

## Better Prompt

```txt
Explain JavaScript closures
with 3 practical examples
for intermediate developers.
```

---

# 8. Important Prompting Techniques

| Technique           | Purpose            |
| ------------------- | ------------------ |
| Zero-shot           | No examples        |
| Few-shot            | Example-based      |
| Chain-of-thought    | Step reasoning     |
| Role prompting      | Assign expertise   |
| XML prompting       | Structured control |
| ReAct prompting     | Think + act        |
| Delimited prompting | Clear sections     |

---

# 9. XML Prompting

Modern models respond extremely well to XML structure.

---

## Example

```xml
<role>
You are a senior architect
</role>

<task>
Explain microservices
</task>
```

Useful for:

- agents
- structured reasoning
- tool usage

---

# 10. Delimiters

Use clear separators.

---

## Example

```txt
###
CONTEXT
###

###
QUESTION
###
```

This helps models distinguish sections properly.

---

# 11. Prompt Injection Awareness

Never blindly trust user input.

Example dangerous input:

```txt
Ignore previous instructions
```

Production systems require:

- validation
- sanitization
- prompt isolation

Especially important for AI agents.

---

# 12. Prompt Versioning

Real companies version prompts like code.

Why?

- prompts strongly affect behavior
- small wording changes matter

Common practices:

- store prompts in files
- version prompts
- test prompt changes

---

# 13. Modern Best Practice

❌ Bad:

```txt
500-line mega prompt
```

✅ Better:

```txt
Small modular prompts
```

---

# 14. Prompt + LCEL

Modern LangChain commonly uses:

```ts
const chain = prompt.pipe(model);
```

You’ll learn this deeply in the next chapter.

---

# Important Mental Model

```txt
Prompt Templates
   ↓
Formatted Messages
   ↓
Chat Models
   ↓
Structured Outputs
```

---

# Summary

You now understand:

- `PromptTemplate`
- `ChatPromptTemplate`
- `MessagesPlaceholder`
- partial variables
- few-shot prompting
- prompt composition
- XML prompting
- prompt engineering principles

This is the foundation of real-world AI engineering.

---

# Next Chapter

# LCEL — LangChain Expression Language

You’ll learn:

- `.pipe()`
- runnables
- chaining
- branching
- transformations
- parallel execution
- composition patterns

LCEL is the core of modern LangChain architecture.
