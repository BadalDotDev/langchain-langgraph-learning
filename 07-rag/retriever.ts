import "dotenv/config";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

async function main() {
  // Load resume PDF
  const loader = new PDFLoader("./07-rag/docs/resume.pdf");
  const docs = await loader.load();

  console.log("\n=== Loaded Resume Documents ===\n");
  console.log(docs.length);

  // Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 80,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  console.log("\n=== Resume Chunks Created ===\n");
  console.log(splitDocs.length);

  // Create embeddings
  const embeddings = new HuggingFaceInferenceEmbeddings();

  // Create vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
  );

  console.log("\n=== Vector Store Ready ===\n");

  // Convert vector store to retriever
  const retriever = vectorStore.asRetriever({
    k: 2,
  });

  console.log("\n=== Retriever Created ===\n");

  // Retrieve relevant chunks
  const retrievedDocs = await retriever.invoke(
    "What frontend technologies does this person know?",
  );

  console.log("\n=== Retrieved Resume Chunks ===\n");

  retrievedDocs.forEach((doc, index) => {
    console.log(`\n--- Retrieved Doc ${index + 1} ---\n`);
    console.log(doc.pageContent);
  });
}

main();
