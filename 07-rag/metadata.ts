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

  let splitDocs = await splitter.splitDocuments(docs);

  console.log("\n=== Original Chunks ===\n");
  console.log(splitDocs.length);

  // -----------------------------------------
  // ADD METADATA (VERY IMPORTANT)
  // -----------------------------------------

  splitDocs = splitDocs.map((doc) => {
    const text = doc.pageContent.toLowerCase();

    let section = "general";

    if (text.includes("project")) section = "projects";
    else if (text.includes("skill")) section = "skills";
    else if (text.includes("education")) section = "education";

    return {
      ...doc,
      metadata: {
        ...doc.metadata,
        section,
      },
    };
  });

  console.log("\n=== Sample Metadata ===\n");
  console.log(splitDocs[0]?.metadata);

  // Embeddings
  const embeddings = new HuggingFaceInferenceEmbeddings();

  // Vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
  );

  // -----------------------------------------
  // WITHOUT FILTER
  // -----------------------------------------

  console.log("\n=== Without Metadata Filter ===\n");

  const allResults = await vectorStore.similaritySearch(
    "What projects has this person worked on?",
    2,
  );

  allResults.forEach((doc, i) => {
    console.log(`\n--- Result ${i + 1} ---`);
    console.log("Section:", doc.metadata.section);
    console.log(doc.pageContent);
  });

  // -----------------------------------------
  // WITH FILTER
  // -----------------------------------------

  console.log("\n==============================\n");
  console.log("\n=== With Metadata Filter (projects only) ===\n");

  const filteredResults = await vectorStore.similaritySearch(
    "What projects has this person worked on?",
    2,
    (doc) => doc.metadata.section === "projects",
  );

  filteredResults.forEach((doc, i) => {
    console.log(`\n--- Filtered Result ${i + 1} ---`);
    console.log("Section:", doc.metadata.section);
    console.log(doc.pageContent);
  });
}

main();
