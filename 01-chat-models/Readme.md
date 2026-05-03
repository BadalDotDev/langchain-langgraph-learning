# Topic 1 — Chat Models (Modern LangChain)

This is the foundation of everything.

Almost every AI workflow eventually becomes:

```text
Messages → Chat Model → Response
```

---

# Folder Structure

```text
01-chat-models/
├── ai-coach.ts
├── basic.ts
├── batch.ts
├── messages.ts
├── metadata.ts
├── stream-chat.ts
├── stream.ts
└── temperature.ts
```

---

# 1. What is a Chat Model?

A chat model is an LLM optimized for conversations.

Instead of plain strings:

```text
"Explain React"
```

we send structured messages:

```text
System: You are a helpful teacher
Human: Explain React
```

Modern AI systems are all message-based.

---

# 2. Why LangChain Chat Models Exist

Without LangChain:

Every provider has different APIs.

With LangChain:

```ts
invoke();
stream();
bindTools();
withStructuredOutput();
```

work similarly across:

- OpenAI
- Groq
- Anthropic
- Gemini
- TogetherAI
- Ollama
- etc.

This standardization is HUGE.

---

# 3. Install Packages

```bash
npm install
```

---

# 4. Get Groq API Key

Create:

```text
.env
```

```env
GROQ_API_KEY=your_key_here
```

---

# 5. Your First Chat Model

File:

```text
basic.ts
```

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

async function main() {
  const response = await model.invoke("Explain LangChain in one paragraph");

  console.log(response);
}

main();
```

Run:

```bash
npx tsx basic.ts
```

---

# 6. Understanding `invoke()`

This is the MOST IMPORTANT method.

```ts
await model.invoke(input);
```

It sends input to the model and returns output.

---

# 7. What Does Response Contain?

The response is NOT just text.

It’s an `AIMessage`.

Contains:

- content
- metadata
- token usage
- response info

Example:

```ts
console.log(response.content);
```

---

# 8. Message Types

Modern chat models use messages.

Main types:

| Type          | Purpose      |
| ------------- | ------------ |
| SystemMessage | Instructions |
| HumanMessage  | User input   |
| AIMessage     | AI response  |
| ToolMessage   | Tool results |

---

# 9. Real Message-Based Example

File:

```text
messages.ts
```

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

async function main() {
  const response = await model.invoke([
    new SystemMessage("You are a senior JavaScript teacher"),
    new HumanMessage("Explain closures simply"),
  ]);

  console.log(response.content);
}

main();
```

---

# 10. System Messages (VERY IMPORTANT)

System messages control model behavior.

Examples:

```text
You are a helpful assistant
You are an expert doctor
You are a strict code reviewer
Answer only in JSON
```

This becomes critical later for:

- agents
- structured outputs
- multi-agent systems

---

# 11. Temperature

Controls randomness.

| Value | Behavior          |
| ----- | ----------------- |
| 0     | Deterministic     |
| 0.3   | Slight creativity |
| 0.7   | Balanced          |
| 1+    | Very creative     |

Recommended:

| Use Case         | Temperature |
| ---------------- | ----------- |
| Coding           | 0           |
| RAG              | 0           |
| Extraction       | 0           |
| Creative writing | 0.7+        |

---

# 12. Temperature Example

File:

```text
temperature.ts
```

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 1,
});

async function main() {
  const response = await model.invoke(
    "Write a creative product slogan for an AI startup",
  );

  console.log(response.content);
}

main();
```

---

# 13. Model Selection

Recommended free Groq models:

| Model                           | Best For    |
| ------------------------------- | ----------- |
| `llama-3.3-70b-versatile`       | General use |
| `deepseek-r1-distill-llama-70b` | Reasoning   |
| `mixtral-8x7b`                  | Speed       |
| `gemma2-9b-it`                  | Lightweight |

---

# 14. Streaming (VERY IMPORTANT)

Instead of waiting for the full response:

```text
Generate...
Wait...
Done
```

we can stream tokens live.

---

# 15. Streaming Example

File:

```text
stream.ts
```

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

async function main() {
  const stream = await model.stream("Write a short poem about AI");

  for await (const chunk of stream) {
    process.stdout.write(chunk.content as string);
  }
}

main();
```

---

# 16. Why Streaming Matters

Streaming is ESSENTIAL for:

- chat apps
- AI copilots
- agents
- dashboards
- realtime UX

Without streaming:

- apps feel slow
- bad UX

---

# 17. Async Iteration

This syntax:

```ts
for await (const chunk of stream)
```

is JavaScript async iteration.

You’ll use this A LOT in AI engineering.

---

# 18. Streaming Chat Example

File:

```text
stream-chat.ts
```

```ts
import "dotenv/config";

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const rl = readline.createInterface({
  input,
  output,
});

async function main() {
  while (true) {
    const question = await rl.question("\nYou: ");

    if (question === "exit") {
      break;
    }

    const stream = await model.stream(question);

    process.stdout.write("\nAI: ");

    for await (const chunk of stream) {
      process.stdout.write(chunk.content as string);
    }

    console.log("\n");
  }

  rl.close();
}

main();
```

---

# 19. Token Usage & Metadata

File:

```text
metadata.ts
```

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

async function main() {
  const response = await model.invoke("Explain vector databases simply");

  console.log(response.content);

  console.log("\nResponse Metadata:");
  console.log(response.response_metadata);

  console.log("\nUsage Metadata:");
  console.log(response.usage_metadata);
}

main();
```

Useful for:

- cost tracking
- debugging
- monitoring

---

# 20. Batch Processing

File:

```text
batch.ts
```

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

async function main() {
  const responses = await model.batch([
    "Explain React",
    "Explain Vue",
    "Explain Angular",
  ]);

  responses.forEach((response, index) => {
    console.log(`\nResponse ${index + 1}:`);
    console.log(response.content);
  });
}

main();
```

Useful for:

- evaluation
- bulk processing
- pipelines

---

# 21. AI Coach Exercise

File:

```text
ai-coach.ts
```

```ts
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

async function main() {
  const response = await model.invoke([
    new SystemMessage("You are an expert fitness coach"),
    new HumanMessage("Create a beginner workout plan"),
  ]);

  console.log(response.content);
}

main();
```

---

# 22. Important Chat Model Methods

| Method                 | Purpose         |
| ---------------------- | --------------- |
| invoke()               | Single response |
| stream()               | Streaming       |
| batch()                | Multiple inputs |
| bindTools()            | Attach tools    |
| withStructuredOutput() | Typed outputs   |

---

# 23. Modern Mental Model

Modern AI apps are basically:

```text
Messages
   ↓
Chat Model
   ↓
Structured Outputs / Tools / Agents
```

Everything builds on this.

---

# 24. Important Architecture Insight

Old tutorials focus on:

- text completion

Modern systems focus on:

- message-based workflows

This is a HUGE conceptual shift.

---

# 25. Recommended Exercises

Do these before moving ahead.

---

## Exercise 1

Build:

- AI fitness coach

Using:

- SystemMessage

---

## Exercise 2

Try:

- different temperatures

Observe:

- response differences

---

## Exercise 3

Use:

- stream()

Create:

- realtime terminal chatbot

---

## Exercise 4

Print:

- token usage
- response metadata

---

# 26. Key Takeaways

By now you should understand:

- how chat models work
- message-based AI workflows
- invoke()
- streaming
- metadata
- temperature
- batch processing

This foundation powers:

- agents
- RAG systems
- AI copilots
- LangGraph workflows
- production AI systems

Everything in LangChain builds on chat models.
