import "dotenv/config";

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";

async function main() {
  const embeddings = new HuggingFaceInferenceEmbeddings();

  const vectorStore = await MemoryVectorStore.fromTexts(
    [
      "React is a frontend library",
      "Next.js uses React",
      "Dogs are loyal animals",
    ],
    [
      { id: "1", category: "frontend" },
      { id: "2", category: "frontend" },
      { id: "3", category: "animals" },
    ],
    embeddings,
  );

  console.log("\n=== Initial Search ===\n");

  let results = await vectorStore.similaritySearch("frontend framework", 3);

  console.log(results);

  // ----------------------------
  // ADD DOCUMENTS
  // ----------------------------

  await vectorStore.addDocuments([
    new Document({
      pageContent: "Angular is a frontend framework",
      metadata: {
        id: "4",
        category: "frontend",
      },
    }),
  ]);

  console.log("\n=== After Adding ===\n");

  results = await vectorStore.similaritySearch("frontend framework", 4);

  console.log(results);

  // ----------------------------
  // DELETE DOCUMENTS (manual)
  // ----------------------------

  vectorStore.memoryVectors = vectorStore.memoryVectors.filter(
    (doc) => doc.metadata.id !== "2",
  );

  console.log("\n=== After Deleting id=2 ===\n");

  results = await vectorStore.similaritySearch("frontend framework", 4);

  console.log(results);

  const retriever = vectorStore.asRetriever();
  console.log("\n=== Using Retriever ===\n");
  results = await retriever.invoke("frontend framework");
  console.log(results);
}

main();
