import "dotenv/config";

import { PromptTemplate } from "@langchain/core/prompts";

// Use this when you already have one prompt string with variables.
const prompt = PromptTemplate.fromTemplate("Explain {topic} in simple terms");

const formatted = await prompt.format({
  topic: "JavaScript closures",
});

console.log("Formatted", formatted);
// Formatted "Explain JavaScript closures in simple terms"

{
  /*
    Use .invoke() if:
      Building LangChain chains
      Using .pipe()
      Using LCEL
      Streaming/batching
  */
}
const invoked = await prompt.invoke({
  topic: "JavaScript closures",
});

console.log("Invoked", invoked);
// Invoked StringPromptValue {
//   lc_serializable: true,
//   lc_kwargs: { value: 'Explain JavaScript closures in simple terms' },
//   lc_namespace: [ 'langchain_core', 'prompt_values' ],
//   value: 'Explain JavaScript closures in simple terms'
// }

{
  /* ----------------- PROMPT + MODEL ----------------- */
}

import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
});

const response = await model.invoke(formatted);
console.log("Response", response);

const response2 = await model.invoke(invoked);
console.log("Response 2", response2);
