# Chapter 04 — Output Parsers + Structured Outputs

This is where AI systems become actual software systems instead of simple chatbots.

Without structured outputs:

```txt id="z2zv7d"
AI returns random text
```

With structured outputs:

```json id="c4e9pt"
{
  "title": "React",
  "difficulty": "medium",
  "estimatedHours": 12
}
```

Structured outputs are essential for:

- agents
- automations
- workflows
- APIs
- databases
- production AI systems

---

# Why Structured Outputs Matter

LLMs are probabilistic systems.

Without constraints:

- inconsistent formatting
- unreliable structure
- parsing issues
- hallucinated outputs

Production systems require:

- predictable outputs
- typed schemas
- validation
- machine-readable data

---

# Main Output Approaches

| Approach               | Reliability |
| ---------------------- | ----------- |
| Plain text             | Low         |
| Prompted JSON          | Medium      |
| Output parsers         | Better      |
| Tool calling           | Excellent   |
| Structured output APIs | Best        |

---

# Main Parser Types

| Parser                   | Purpose       |
| ------------------------ | ------------- |
| `StringOutputParser`     | Plain text    |
| `JsonOutputParser`       | JSON          |
| `StructuredOutputParser` | Typed schemas |
| CSV Parser               | Lists         |
| XML Parser               | XML           |

---

# StringOutputParser

The simplest parser.

Converts:

```txt id="aqm1mg"
AIMessage
```

into:

```txt id="w4wqqi"
string
```

---

## Example

```ts id="g0m29z"
import { StringOutputParser } from "@langchain/core/output_parsers";

const parser = new StringOutputParser();
```

You already used this in LCEL pipelines.

---

# JsonOutputParser

Used to parse JSON responses.

---

## Example

```ts id="fj0d8m"
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { JsonOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const parser = new JsonOutputParser();

const prompt = ChatPromptTemplate.fromTemplate(`
Return ONLY valid JSON.

Topic: {topic}

Format:
{{
  "summary": "string",
  "difficulty": "easy|medium|hard"
}}
`);

const chain = prompt.pipe(model).pipe(parser);

async function main() {
  const response = await chain.invoke({
    topic: "LangGraph",
  });

  console.log(response);
}

main();
```

---

# Important Limitation

This approach still relies on prompting.

Meaning:

- the model may still break JSON
- outputs can remain inconsistent

Better approaches exist.

---

# Zod (Very Important)

Modern TypeScript AI systems heavily use Zod.

Zod provides:

- schema validation
- runtime safety
- type inference
- typed AI outputs

---

# Install Zod

```bash id="w4n0jk"
npm install zod
```

---

# Basic Zod Schema

```ts id="r8zkkr"
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  difficulty: z.string(),
  duration: z.number(),
});
```

---

# Why Zod is Powerful

You get:

- validation
- runtime guarantees
- inferred TypeScript types

Example:

```ts id="c8q4ur"
type Course = z.infer<typeof schema>;
```

AI outputs become type-safe.

This is extremely important in production systems.

---

# StructuredOutputParser

An older structured parsing approach.

---

## Example

```ts id="kk0m3t"
import { StructuredOutputParser } from "@langchain/core/output_parsers";

import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    answer: z.string(),
    score: z.number(),
  }),
);
```

---

# Format Instructions

The parser can automatically generate formatting instructions.

```ts id="ef9xar"
parser.getFormatInstructions();
```

This is a very important concept.

---

# Full StructuredOutputParser Example

```ts id="fk6jvl"
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { StructuredOutputParser } from "@langchain/core/output_parsers";

import { z } from "zod";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    concept: z.string(),
    difficulty: z.string(),
    examples: z.array(z.string()),
  }),
);

const prompt = ChatPromptTemplate.fromTemplate(`
Explain {topic}

{format_instructions}
`);

const chain = prompt.pipe(model).pipe(parser);

async function main() {
  const response = await chain.invoke({
    topic: "closures",

    format_instructions: parser.getFormatInstructions(),
  });

  console.log(response);
}

main();
```

---

# The Modern Best Approach

Use:

```ts id="s0t4bg"
withStructuredOutput();
```

This is the modern and preferred method.

---

# withStructuredOutput()

Uses:

- native structured output support
- tool calling internally
- schema enforcement

This is significantly more reliable.

---

## Example

```ts id="x9w9rh"
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { z } from "zod";

const schema = z.object({
  title: z.string(),
  summary: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
}).withStructuredOutput(schema);

async function main() {
  const response = await model.invoke("Explain React hooks");

  console.log(response);
}

main();
```

---

# Why This is Better

Instead of:

- asking the model for JSON

You define:

- an actual schema

The model must comply with that structure.

This is much more reliable.

---

# Typed AI Responses

Responses now become:

```ts id="l0j0df"
{
  title: string;
  summary: string;
  difficulty: "easy" | "medium" | "hard";
}
```

This is production-grade AI engineering.

---

# Enums

Very useful for classifications and workflows.

```ts id="f7b8uv"
z.enum(["low", "medium", "high"]);
```

Great for:

- routing
- classifications
- workflow states

---

# Arrays

```ts id="o4dk7v"
z.array(z.string());
```

---

# Nested Schemas

Extremely common in real systems.

```ts id="oz8p4m"
const schema = z.object({
  user: z.object({
    name: z.string(),
    age: z.number(),
  }),

  skills: z.array(z.string()),
});
```

---

# Optional Fields

```ts id="rz1g0m"
z.string().optional();
```

---

# Validation Errors

Zod catches invalid outputs automatically.

Examples:

- wrong types
- missing fields
- invalid enums

Critical for reliability.

---

# Real Production Use Cases

Structured outputs power:

- AI workflows
- database inserts
- APIs
- automations
- agents
- extraction systems
- routing systems

---

# Information Extraction

One of the best use cases.

---

## Example

Input text:

```txt id="a5m9g0"
John works at OpenAI as a designer.
```

Structured output:

```json id="p3f2hm"
{
  "name": "John",
  "company": "OpenAI",
  "role": "designer"
}
```

This is massive in enterprise AI.

---

# Classification Systems

Example:

```json id="a2nzsu"
{
  "priority": "high",
  "department": "billing"
}
```

Used in:

- customer support
- ticket routing
- workflow automation

---

# Agent Systems Depend on This

Agents require:

- reliable actions
- validated decisions
- structured outputs

Without structured outputs:

- agents become unstable

---

# Important Modern Insight

Old AI systems focused on:

```txt id="fwc3u5"
Human-readable output
```

Modern AI systems focus on:

```txt id="y6u7u4"
Machine-readable output
```

This is a massive mindset shift.

---

# Combining Structured Outputs with LCEL

Structured outputs fit perfectly into LCEL pipelines.

Example:

```ts id="ytf6g3"
const chain = prompt.pipe(model.withStructuredOutput(schema));
```

---

# Streaming Structured Outputs

Advanced topic, but supported.

Useful for:

- realtime agents
- dashboards
- workflow systems

---

# Common Patterns

---

## Pattern 1 — Extraction

```txt id="s0v1r5"
Text → Structured Data
```

---

## Pattern 2 — Classification

```txt id="a4i8q1"
Input → Label
```

---

## Pattern 3 — Workflow Routing

```txt id="u4p6s0"
Input → Decision Schema
```

---

## Pattern 4 — Agent Planning

```txt id="z6f9v4"
Goal → Structured Plan
```

---

# Important Best Practices

---

## Prefer

```ts id="m4r0zx"
withStructuredOutput();
```

instead of fragile JSON prompting.

---

## Use Enums

Whenever possible.

---

## Keep Schemas Small

Large schemas increase failure probability.

---

## Validate Everything

Never trust raw model output blindly.

---

# Important Mental Model

```txt id="a2f8h9"
LLM Output
   ↓
Schema Validation
   ↓
Typed Data
   ↓
Reliable Software System
```

---

# Summary

You now understand:

- output parsers
- JSON parsing
- Zod schemas
- structured outputs
- typed AI responses
- validation
- extraction systems
- `withStructuredOutput()`

This is where AI apps become real software systems.

---

# Next Chapter

# Embeddings

You’ll learn:

- vector embeddings
- semantic search
- cosine similarity
- embedding models
- retrieval systems
- chunk embeddings

This is the foundation of:

- RAG
- semantic search
- recommendation systems
- AI memory systems
- retrieval architectures
