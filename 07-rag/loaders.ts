import "dotenv/config";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function main() {
  const loader = new PDFLoader("./07-rag/docs/resume.pdf");

  // Returns an array of Documents
  const docs = await loader.load();

  console.log("\n=== Total Documents Loaded ===\n");
  console.log(docs.length);

  console.log("\n=== First Document ===\n");
  console.log(docs[0]);

  console.log("\n=== First Document Content Preview ===\n");
  console.log(docs[0]?.pageContent.slice(0, 1000));

  console.log("\n=== First Document Metadata ===\n");
  console.log(docs[0]?.metadata);
}

main();
