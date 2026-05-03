import "dotenv/config";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

async function main() {
  // Load PDF
  const loader = new PDFLoader("./07-rag/docs/resume.pdf");
  const docs = await loader.load();

  // Split documents
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  console.log("\n=== Total Chunks ===\n");
  console.log(splitDocs.length);

  // Create embeddings model
  const embeddings = new HuggingFaceInferenceEmbeddings();

  // Convert one chunk into vector embedding
  const vector = await embeddings.embedQuery(splitDocs[0]?.pageContent || "");

  console.log("\n=== Embedding Vector Length ===\n");
  console.log(vector.length);

  console.log("\n=== First 20 Values of Embedding ===\n");
  console.log(vector.slice(0, 20));
}

main();
