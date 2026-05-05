import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { tool } from "@langchain/core/tools";

import { z } from "zod";

const weatherTool = tool(
  async ({ city }) => {
    return `Weather in ${city} is 35°C`;
  },

  {
    name: "weather_tool",

    description: "Get weather for a city",

    schema: z.object({
      city: z.string(),
    }),
  },
);

const calculatorTool = tool(
  async ({ a, b }) => {
    return String(a + b);
  },

  {
    name: "calculator_tool",

    description: "Add two numbers",

    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
  },
);

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const modelWithTools = model.bindTools([weatherTool, calculatorTool]);

async function main() {
  const response = await modelWithTools.invoke("What is weather in Ahmedabad?");

  console.log(response);

  console.log("\nTool Calls:");

  console.log(response.tool_calls);
}

main();
