import "dotenv/config";
import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

async function main() {
  const response = await model.invoke(
    "Explain protein intake for muscle gain.",
  );
  console.log(response);

  console.log("\n=== CONTENT ===\n");
  console.log(response.content);

  console.log("\n=== TOKEN USAGE ===\n");
  console.log(response.usage_metadata);

  console.log("\n=== RESPONSE METADATA ===\n");
  console.log(response.response_metadata);
}

main();
