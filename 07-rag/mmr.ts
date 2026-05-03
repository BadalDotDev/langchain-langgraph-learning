import "dotenv/config";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

async function main() {
  // Load resume
  const loader = new PDFLoader("./07-rag/docs/resume.pdf");
  const docs = await loader.load();

  // Split
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 80,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  // Embeddings
  const embeddings = new HuggingFaceInferenceEmbeddings();

  // Vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
  );

  console.log("\n=== Normal Similarity Search ===\n");

  const normalRetriever = vectorStore.asRetriever({
    k: 3,
  });

  const normalDocs = await normalRetriever.invoke(
    "What technologies does this person know?",
  );

  normalDocs.forEach((doc, i) => {
    console.log(`\n--- Normal Result ${i + 1} ---\n`);
    console.log(doc.pageContent);
  });

  console.log("\n==============================\n");

  console.log("\n=== MMR Search ===\n");

  const mmrRetriever = vectorStore.asRetriever({
    k: 3,
    searchType: "mmr",
  });

  const mmrDocs = await mmrRetriever.invoke(
    "What technologies does this person know?",
  );

  mmrDocs.forEach((doc, i) => {
    console.log(`\n--- MMR Result ${i + 1} ---\n`);
    console.log(doc.pageContent);
  });
}

main();
