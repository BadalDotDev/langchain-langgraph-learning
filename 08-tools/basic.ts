import { tool } from "@langchain/core/tools";

import { z } from "zod";

const helloTool = tool(
  async ({ name }) => {
    return `Hello ${name}`;
  },

  {
    name: "hello_tool",

    description: "Say hello to a user",

    schema: z.object({
      name: z.string(),
    }),
  },
);

async function main() {
  const result = await helloTool.invoke({
    name: "Harsh",
  });

  console.log(result);
}

main();
