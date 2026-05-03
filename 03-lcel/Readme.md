# Chapter 03 — LCEL (LangChain Expression Language)

LCEL is the core architecture of modern LangChain.

If you deeply understand LCEL, you understand how modern AI workflows are built using LangChain.

---

# What is LCEL?

LCEL = **LangChain Expression Language**

It is a system for composing AI workflows using **runnables**.

Think of it like:

```txt id="2l9f9f"
Unix pipes for AI
```

Example:

```ts id="r3k5na"
prompt.pipe(model).pipe(parser);
```

Flow:

```txt id="m4m1kj"
Prompt
  ↓
Model
  ↓
Parser
```

---

# Why LCEL Exists

Older LangChain had:

- too many chain classes
- rigid abstractions
- complicated APIs

LCEL replaces that with:

- composable primitives
- reusable workflows
- clean pipelines
- functional composition

Modern LangChain is LCEL-first.

---

# Core Concept — Runnable

Everything in LCEL is a Runnable.

Examples:

- prompt templates
- chat models
- parsers
- retrievers
- tools
- custom functions

All runnables support:

- `invoke()`
- `batch()`
- `stream()`
- `pipe()`

---

# Important Runnable Methods

| Method      | Purpose           |
| ----------- | ----------------- |
| `invoke()`  | Single execution  |
| `batch()`   | Multiple inputs   |
| `stream()`  | Streaming         |
| `ainvoke()` | Async invoke      |
| `pipe()`    | Compose workflows |

---

# Your First LCEL Chain

```ts id="y8m0ub"
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const prompt = ChatPromptTemplate.fromTemplate("Explain {topic} simply");

const chain = prompt.pipe(model);

async function main() {
  const response = await chain.invoke({
    topic: "closures",
  });

  console.log(response.content);
}

main();
```

---

# What Happened Internally?

```ts id="r1oz8d"
prompt.pipe(model);
```

creates a runnable pipeline.

Flow:

```txt id="x0g67x"
Variables
   ↓
Prompt Template
   ↓
Formatted Messages
   ↓
Model
   ↓
AIMessage
```

---

# Why `.pipe()` is Powerful

You can connect any runnable.

Example:

```txt id="u6p3f0"
Prompt
  ↓
LLM
  ↓
Parser
  ↓
Custom Function
  ↓
Database
```

This composability is the foundation of LCEL.

---

# Adding an Output Parser

```ts id="t9dbgo"
import { StringOutputParser } from "@langchain/core/output_parsers";

const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);
```

Now the final output becomes a plain string.

---

# Full LCEL Example

```ts id="yr3uqx"
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const prompt = ChatPromptTemplate.fromTemplate(
  "Explain {topic} in simple terms",
);

const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);

async function main() {
  const response = await chain.invoke({
    topic: "event loop",
  });

  console.log(response);
}

main();
```

---

# LCEL Mental Model

Everything becomes:

```txt id="c0z7na"
Input
 ↓
Runnable
 ↓
Runnable
 ↓
Runnable
 ↓
Output
```

---

# RunnableSequence

`.pipe()` internally creates a `RunnableSequence`.

Equivalent:

```ts id="nm0w7q"
RunnableSequence.from([prompt, model, parser]);
```

But `.pipe()` is cleaner and preferred.

---

# RunnableLambda

Used for custom JavaScript logic.

Very important for transformations.

---

## Example

```ts id="d0st0m"
import { RunnableLambda } from "@langchain/core/runnables";

const uppercase = RunnableLambda.from((input: string) => {
  return input.toUpperCase();
});
```

---

# RunnableLambda in a Chain

```ts id="z6ihg0"
const chain = prompt.pipe(model).pipe(parser).pipe(uppercase);
```

Flow:

```txt id="ahk6df"
Prompt
 ↓
Model
 ↓
String Parser
 ↓
Uppercase Function
```

---

# RunnablePassthrough

Passes data unchanged.

Useful for:

- preserving inputs
- merging outputs
- RAG pipelines

---

## Example

```ts id="l5n9k4"
import { RunnablePassthrough } from "@langchain/core/runnables";
```

Very important later for Retrieval-Augmented Generation (RAG).

---

# RunnableParallel

Runs multiple chains simultaneously.

---

## Example

```ts id="a9m7e5"
import { RunnableParallel } from "@langchain/core/runnables";

const parallel = RunnableParallel.from({
  joke: jokeChain,
  poem: poemChain,
});
```

---

# Parallel Flow

```txt id="i7e3bm"
          Input
            ↓
     ┌────────────┐
     ↓            ↓
 Joke Chain   Poem Chain
     ↓            ↓
     └────────────┘
            ↓
         Combined
```

---

# Practical Parallel Example

```ts id="w8vn0r"
const jokePrompt = ChatPromptTemplate.fromTemplate("Tell a joke about {topic}");

const poemPrompt = ChatPromptTemplate.fromTemplate(
  "Write a poem about {topic}",
);

const jokeChain = jokePrompt.pipe(model).pipe(parser);

const poemChain = poemPrompt.pipe(model).pipe(parser);

const parallel = RunnableParallel.from({
  joke: jokeChain,
  poem: poemChain,
});

const result = await parallel.invoke({
  topic: "AI",
});

console.log(result);
```

---

# RunnableBranch

Used for conditional execution.

Similar to:

- if/else
- routing
- adaptive workflows

---

## Example

```ts id="cvp72q"
import { RunnableBranch } from "@langchain/core/runnables";
```

Used heavily in:

- agents
- routing systems
- adaptive RAG

---

# Branching Concept

```txt id="3u6zsi"
Input
 ↓
Condition
 ↓
Different Chains
```

---

# Streaming with LCEL

Entire pipelines can stream.

```ts id="0mq8ih"
const stream = await chain.stream({
  topic: "LangGraph",
});

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

This allows realtime streaming even in complex workflows.

---

# Batch Processing

Run pipelines on multiple inputs.

```ts id="1x2szw"
const responses = await chain.batch([
  { topic: "React" },
  { topic: "Vue" },
  { topic: "Angular" },
]);
```

Useful for:

- evaluations
- dataset generation
- bulk AI processing

---

# Assign

Attach extra fields to outputs.

```ts id="m7r4v1"
chain.assign({
  timestamp: () => Date.now(),
});
```

Useful for:

- metadata
- observability
- pipeline tracking

---

# Bind

Attach configuration to a runnable.

```ts id="c7d6k5"
model.bind({
  temperature: 0,
});
```

---

# Retry Logic

```ts id="n9u2fh"
chain.withRetry();
```

Useful for:

- unstable APIs
- production reliability

---

# Fallback Models

Very important in production systems.

```ts id="u4x8rw"
primaryModel.withFallbacks([backupModel]);
```

If one model fails:

- automatically switch to another model

---

# Why LCEL is Revolutionary

Before LCEL:

- rigid chains
- difficult composition
- too many abstractions

After LCEL:

- reusable workflows
- composable architecture
- functional pipelines
- scalable systems

LCEL made LangChain significantly cleaner.

---

# Real Production Pipeline

Modern AI systems often look like this:

```txt id="j8q2vm"
Input
 ↓
Prompt
 ↓
Retriever
 ↓
Formatter
 ↓
LLM
 ↓
Parser
 ↓
Validator
 ↓
Database
```

All built using LCEL.

---

# Important Insight

LCEL is not just chaining.

It is:

- orchestration
- transformation
- composition
- execution framework

---

# Common LCEL Patterns

---

## Pattern 1 — Prompt → Model

```ts id="p5z0ce"
prompt.pipe(model);
```

---

## Pattern 2 — Prompt → Model → Parser

```ts id="r4d1la"
prompt.pipe(model).pipe(parser);
```

---

## Pattern 3 — Parallel Chains

```ts id="q9n1vk"
RunnableParallel.from({});
```

---

## Pattern 4 — Custom Functions

```ts id="e0m2ku"
.pipe(RunnableLambda.from())
```

---

## Pattern 5 — RAG Pipelines

```txt id="6i6aq4"
Retriever
 ↓
Prompt
 ↓
LLM
```

---

# Critical Modern Insight

Modern LangChain architecture is essentially:

```txt id="3jhtz0"
LCEL + LangGraph
```

That is the real foundation.

---

# Important Mental Model

```txt id="2m0x8g"
Input
 ↓
Composable Runnables
 ↓
AI Workflow
 ↓
Output
```

---

# Summary

You now understand:

- runnables
- `.pipe()`
- `RunnableSequence`
- `RunnableLambda`
- `RunnableParallel`
- `RunnableBranch`
- streaming
- batching
- composition patterns

This is the core architecture of modern LangChain.

---

# Next Chapter

# Output Parsers + Structured Outputs

You’ll learn:

- JSON outputs
- schema validation
- Zod integration
- structured extraction
- typed AI responses
- `withStructuredOutput()`

This is essential for production-grade AI systems.
