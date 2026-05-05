import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { tool } from "@langchain/core/tools";

import {
  HumanMessage,
  ToolMessage,
  BaseMessage,
} from "@langchain/core/messages";

import { z } from "zod";

const weatherTool = tool(
  async ({ city }) => {
    return `Weather in ${city} is 32°C`;
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

const tools = [weatherTool, calculatorTool];

const toolMap: Record<string, any> = {
  weather_tool: weatherTool,
  calculator_tool: calculatorTool,
};

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const modelWithTools = model.bindTools(tools);

async function main() {
  // IMPORTANT:
  // Use BaseMessage[] instead
  const messages: BaseMessage[] = [
    new HumanMessage("What's the weather in Ahmedabad?"),
  ];

  const response = await modelWithTools.invoke(messages);

  console.log("\nInitial Response:\n");

  console.log(response);

  if (response.tool_calls && response.tool_calls.length > 0) {
    for (const toolCall of response.tool_calls) {
      const toolName = toolCall.name;

      const selectedTool = toolMap[toolName];

      if (!selectedTool) {
        continue;
      }

      // FIX:
      // Cast args as any
      const toolResult = await selectedTool.invoke(toolCall.args as any);

      console.log("\nTool Result:\n");

      console.log(toolResult);

      // Push AI message
      messages.push(response);

      // Push tool result
      messages.push(
        new ToolMessage({
          tool_call_id: toolCall.id!,
          content: String(toolResult),
        }),
      );

      const finalResponse = await modelWithTools.invoke(messages);

      console.log("\nFinal Response:\n");

      console.log(finalResponse.content);
    }
  }
}

main();
