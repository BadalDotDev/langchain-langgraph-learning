import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings();

const article = `
LangChain helps developers build AI applications using LLMs.
It supports chains, agents, tools, memory, and retrieval.
Embeddings help in semantic search and RAG systems.
`;

function chunkText(text: string, size = 60) {
  const chunks = [];

  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
}

async function main() {
  const chunks = chunkText(article);

  console.log("Chunks:");
  console.log(chunks);

  const vectors = await embeddings.embedDocuments(chunks);

  console.log("\nTotal Chunk Embeddings:", vectors.length);
  console.log("Vector Size:", vectors?.[0]?.length);
}

main();
