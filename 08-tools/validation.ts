import { tool } from "@langchain/core/tools";

import { z } from "zod";

const emailTool = tool(
  async ({ email }) => {
    return `Sending email to ${email}`;
  },

  {
    name: "email_tool",

    description: "Send email to a user",

    schema: z.object({
      email: z.string().email().describe("Valid email address"),
    }),
  },
);

async function main() {
  try {
    const result = await emailTool.invoke({
      email: "invalid-email",
    });

    console.log(result);
  } catch (error) {
    console.log("Validation Error:");

    console.log(error);
  }
}

main();
