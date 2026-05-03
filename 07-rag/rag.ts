import "dotenv/config";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function main() {
  // 1. Load resume
  const loader = new PDFLoader("./07-rag/docs/resume.pdf");
  const docs = await loader.load();

  // 2. Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 80,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  // 3. Embeddings
  const embeddings = new HuggingFaceInferenceEmbeddings();

  // 4. Vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
  );

  // 5. Retriever
  const retriever = vectorStore.asRetriever({
    k: 3,
  });

  // 6. Retrieve relevant docs
  const retrievedDocs = await retriever.invoke(
    "What frontend technologies does this person know?",
  );

  // 7. Create context string
  const context = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");

  console.log("\n=== Retrieved Context ===\n");
  console.log(context);

  // 8. Prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`
You are an AI assistant analyzing a candidate's resume.

Use ONLY the provided context to answer the question.

If the answer is not present, say "Not mentioned in resume".

Context:
{context}

Question:
{question}
`);

  // 9. LLM
  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
  });

  const parser = new StringOutputParser();

  // 10. Chain
  const chain = prompt.pipe(model).pipe(parser);

  // 11. Ask question
  const response = await chain.invoke({
    context,
    question: "What frontend technologies does this person know?",
  });

  console.log("\n=== Final Answer ===\n");
  console.log(response);
}

main();
