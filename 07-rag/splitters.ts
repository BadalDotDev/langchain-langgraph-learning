import "dotenv/config";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

async function main() {
  // Load PDF
  const loader = new PDFLoader("./07-rag/docs/resume.pdf");
  const docs = await loader.load();

  console.log("\n=== Original Documents ===\n");
  console.log(docs.length);

  console.log("\n=== Original First Document Length ===\n");
  console.log(docs[0]?.pageContent.length);

  // Create splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  // Split documents into chunks
  const splitDocs = await splitter.splitDocuments(docs);

  console.log("\n=== Total Chunks After Splitting ===\n");
  console.log(splitDocs.length);

  console.log("\n=== First Chunk ===\n");
  console.log(splitDocs[0]);

  console.log("\n=== First Chunk Length ===\n");
  console.log(splitDocs[0]?.pageContent.length);

  console.log("\n=== First Chunk Metadata ===\n");
  console.log(splitDocs[0]?.metadata);
}

main();
