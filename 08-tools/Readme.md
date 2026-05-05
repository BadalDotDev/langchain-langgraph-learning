# Topic 8 — Tools

This is where AI stops being just a chatbot and starts becoming an AGENT.

Without tools:

```text id="t1"
LLM can only generate text
```

With tools:

```text id="t2"
LLM can:
- search web
- query DBs
- call APIs
- send emails
- execute code
- use calculators
- access files
```

This is the foundation of:

- AI agents
- copilots
- autonomous workflows
- AI automation systems

---

# 1. What is a Tool?

A tool is simply:

```text id="t3"
A function the LLM can call
```

Example:

```ts id="t4"
function getWeather(city) {
  return "32°C";
}
```

LLM decides:

- when to call it
- with what arguments

VERY important mental model.

---

# 2. Why Tools Matter

LLMs alone are limited.

They:

- don't know realtime info
- can't access APIs
- can't calculate reliably
- can't interact with systems

Tools solve this.

---

# 3. Tool Calling Flow

```text id="t5"
User Question
 ↓
LLM decides tool needed
 ↓
Tool execution
 ↓
Tool result
 ↓
LLM final response
```

This is modern agent architecture.

---

# 4. Modern Terminology

Different companies use different terms:

| Company   | Name             |
| --------- | ---------------- |
| OpenAI    | Function Calling |
| Anthropic | Tool Use         |
| LangChain | Tools            |
| Google    | Function Calling |

Same core concept.

---

# 5. Core LangChain Tool APIs

| API                   | Purpose            |
| --------------------- | ------------------ |
| tool()                | Create tools       |
| DynamicStructuredTool | Advanced tools     |
| StructuredTool        | Schema-based tools |
| ToolNode              | LangGraph tools    |

---

# 6. Simplest Tool

```ts id="t6"
import { tool } from "@langchain/core/tools";

const weatherTool = tool(
  async ({ city }) => {
    return `Weather in ${city} is sunny`;
  },

  {
    name: "get_weather",

    description: "Get weather for a city",

    schema: z.object({
      city: z.string(),
    }),
  },
);
```

---

# 7. Important Components

Every tool has:

| Field       | Purpose          |
| ----------- | ---------------- |
| name        | Tool identifier  |
| description | Helps LLM decide |
| schema      | Input validation |
| function    | Actual execution |

---

# 8. Zod Schemas are CRITICAL

LLMs need structured inputs.

Example:

```ts id="t7"
schema: z.object({
  city: z.string(),
});
```

This tells model:

- what arguments exist
- expected types

VERY important.

---

# 9. Install Zod (if needed)

```bash id="t8"
npm install zod
```

---

# 10. Full Tool Example

```ts id="t9"
import "dotenv/config";

import { z } from "zod";

import { tool } from "@langchain/core/tools";

const calculatorTool = tool(
  async ({ a, b }) => {
    return String(a + b);
  },

  {
    name: "calculator",

    description: "Add two numbers",

    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  },
);

async function main() {
  const result = await calculatorTool.invoke({
    a: 5,
    b: 7,
  });

  console.log(result);
}

main();
```

---

# 11. Important Mental Model

Tools are just runnables.

Meaning:

- invoke()
- pipe()
- LCEL compatible

Everything in modern LangChain is composable.

---

# 12. Tool Calling with Models

Modern models can decide:

- whether tools are needed

This is MASSIVE.

---

# 13. bindTools()

Attach tools to model.

---

# Example

```ts id="t10"
const modelWithTools = model.bindTools([weatherTool]);
```

Now model knows:

- available tools
- schemas
- descriptions

---

# 14. Full Tool Calling Example

```ts id="t11"
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { z } from "zod";

import { tool } from "@langchain/core/tools";

const weatherTool = tool(
  async ({ city }) => {
    return `Weather in ${city} is 32°C`;
  },

  {
    name: "weather",

    description: "Get weather for a city",

    schema: z.object({
      city: z.string(),
    }),
  },
);

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const modelWithTools = model.bindTools([weatherTool]);

async function main() {
  const response = await modelWithTools.invoke(
    "What's the weather in Ahmedabad?",
  );

  console.log(response);
}

main();
```

---

# 15. What Happens Internally?

Model may return:

```json id="t12"
{
  "tool": "weather",
  "args": {
    "city": "Ahmedabad"
  }
}
```

Then:

- tool executes
- result returned

---

# 16. AIMessage Tool Calls

Tool calls appear inside:

```ts id="t13"
response.tool_calls;
```

VERY important.

---

# Example

```ts id="t14"
console.log(response.tool_calls);
```

---

# 17. Tool Execution Loop

Basic agent loop:

```text id="t15"
LLM
 ↓
Tool Call
 ↓
Execute Tool
 ↓
Return Result
 ↓
LLM Continues
```

This becomes agent behavior.

---

# 18. Multiple Tools

Models can choose among many tools.

Example:

```ts id="t16"
model.bindTools([weatherTool, calculatorTool, searchTool]);
```

LLM decides which tool to use.

---

# 19. Tool Descriptions are EXTREMELY Important

Bad description:

```text id="t17"
Gets stuff
```

Good description:

```text id="t18"
Get current weather
for a given city
```

Tool quality depends heavily on descriptions.

---

# 20. Tool Schema Best Practices

---

## Keep Schemas Small

Bad:

```text id="t19"
50 fields
```

Good:

- minimal arguments

---

## Use Enums

```ts id="t20"
z.enum(["celsius", "fahrenheit"]);
```

Improves reliability.

---

## Add Descriptions

```ts id="t21"
z.string().describe("City name");
```

Very helpful for models.

---

# 21. StructuredTool

Advanced schema-based tools.

Usually:

- tool() is enough

But StructuredTool provides:

- more customization

---

# 22. Dynamic Tools

You can dynamically create tools.

Useful for:

- plugin systems
- multi-tenant systems
- MCP-like architectures

Advanced topic later.

---

# 23. Real Tool Examples

| Tool          | Purpose       |
| ------------- | ------------- |
| Search        | Web search    |
| Database      | Query DB      |
| Email         | Send emails   |
| Slack         | Send messages |
| Calendar      | Create events |
| Calculator    | Math          |
| Code executor | Run code      |
| File reader   | Read files    |
| CRM           | Customer data |

Modern agents are tool orchestration systems.

---

# 24. Important Production Insight

Tool reliability matters MORE than:

- model intelligence

Bad tools:

- unstable agents

Reliable tools:

- powerful systems

Huge insight.

---

# 25. Tool Errors

Tools can fail.

Example:

- API down
- invalid args
- timeout

Agents must handle this gracefully.

---

# 26. Tool Validation

Zod catches:

- invalid types
- missing fields
- malformed inputs

Critical for production safety.

---

# 27. Tool Calling vs RAG

VERY important distinction.

| RAG                | Tools           |
| ------------------ | --------------- |
| Retrieve knowledge | Perform actions |
| Read-only          | Action-oriented |
| Context injection  | Execution       |
| Search info        | Do things       |

Modern agents use BOTH.

---

# 28. Tool Routing

LLM acts like:

- intelligent router

Choosing:

- which tool
- when
- with what inputs

This is foundational agent behavior.

---

# 29. Sequential Tool Usage

Agents can chain tools.

Example:

```text id="t22"
Search user
 ↓
Get orders
 ↓
Generate summary
```

This becomes workflow orchestration.

---

# 30. Parallel Tool Calling

Some models support:

- multiple simultaneous tool calls

Useful for:

- performance
- multi-source retrieval

---

# 31. Human-in-the-Loop

Production agents often require:

- approval before actions

Especially for:

- payments
- emails
- deletions

VERY important production pattern.

---

# 32. Tool Security (CRITICAL)

Never allow unrestricted:

- shell access
- DB access
- file system access

Tool permissions are VERY important.

---

# 33. Common Tool Patterns

---

## Pattern 1 — Search

```text id="t23"
Question → Search Tool
```

---

## Pattern 2 — Calculator

```text id="t24"
Math → Calculator Tool
```

---

## Pattern 3 — API Integration

```text id="t25"
Question → External API
```

---

## Pattern 4 — Database Query

```text id="t26"
Question → SQL Tool
```

---

# 34. Tool Calling + LCEL

Tools integrate seamlessly.

Example:

```ts id="t27"
prompt.pipe(model.bindTools([searchTool]));
```

---

# 35. Important Modern Insight

Modern AI systems are increasingly:

```text id="t28"
LLM
+
Tools
+
Retrieval
```

This is the new application architecture.

---

# 36. Tool Calling ≠ Full Agents

VERY important.

Tool calling alone:

- does NOT equal agents

Agents additionally need:

- planning
- looping
- memory
- state management
- orchestration

Next topics soon.

---

# 37. Recommended Folder Structure

```text id="t29"
08-tools/
 ├── src/
 │   ├── basic.ts
 │   ├── weather.ts
 │   ├── calculator.ts
 │   ├── multi-tools.ts
 │   ├── validation.ts
 │   ├── schemas.ts
 │   └── tool-calls.ts
```

---

# 38. Exercises

VERY important.

---

## Exercise 1

Build:

- calculator tool

---

## Exercise 2

Build:

- fake weather tool

---

## Exercise 3

Bind:

- multiple tools

Observe:

- model tool selection

---

## Exercise 4

Add:

- enums
- descriptions
- validation

Improve tool reliability.

---

## Exercise 5

Create:

- fake database tool

Return:

- mock customer data

---

# 39. Important Industry Insight

The AI industry is shifting from:

```text id="t30"
Chatbots
```

toward:

```text id="t31"
Action-oriented AI systems
```

Tools are the foundation of this shift.

---

# 40. What You Learned

You now understand:

- tools
- function calling
- bindTools()
- schemas
- Zod validation
- tool routing
- tool execution
- tool patterns
- action-oriented AI

You now have the foundation required for agents.

---

# 41. Next Topic (HUGE)

# Agents

This is where:

- reasoning
- tool usage
- planning
- looping
- decision making

all come together.

You’ll learn:

- ReAct
- agent loops
- agent executors
- reasoning/action cycles
- tool orchestration
- autonomous workflows
- modern agent architecture

This is where AI engineering becomes REALLY powerful.
