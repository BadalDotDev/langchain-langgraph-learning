import { tool } from "@langchain/core/tools";

import { z } from "zod";

const weatherTool = tool(
  async ({ city, unit }) => {
    return `Weather in ${city} is 32° ${unit}`;
  },

  {
    name: "weather_tool",

    description: "Get current weather for a city",

    schema: z.object({
      city: z.string().describe("City name"),

      unit: z.enum(["celsius", "fahrenheit"]).describe("Temperature unit"),
    }),
  },
);

async function main() {
  const result = await weatherTool.invoke({
    city: "Ahmedabad",
    unit: "celsius",
  });

  console.log(result);
}

main();
