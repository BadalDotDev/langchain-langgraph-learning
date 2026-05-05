import { tool } from "@langchain/core/tools";

import { z } from "zod";

const calculatorTool = tool(
  async ({ a, b, operation }) => {
    switch (operation) {
      case "add":
        return String(a + b);

      case "subtract":
        return String(a - b);

      case "multiply":
        return String(a * b);

      case "divide":
        return String(a / b);

      default:
        return "Invalid operation";
    }
  },

  {
    name: "calculator_tool",

    description: "Perform mathematical calculations",

    schema: z.object({
      a: z.number(),

      b: z.number(),

      operation: z.enum(["add", "subtract", "multiply", "divide"]),
    }),
  },
);

async function main() {
  const result = await calculatorTool.invoke({
    a: 10,
    b: 5,
    operation: "multiply",
  });

  console.log(result);
}

main();
