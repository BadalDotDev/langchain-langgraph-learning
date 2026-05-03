# Topic 7 — RAG (Retrieval Augmented Generation)

This is one of the MOST important concepts in modern AI engineering.

Most real-world AI apps today are some form of RAG.

Examples:

- PDF chatbots
- AI support systems
- company knowledge assistants
- coding copilots
- legal assistants
- medical search systems
- enterprise AI search

---

# 1. What is RAG?

RAG = Retrieval Augmented Generation

Meaning:

```text id="r1"
Retrieve relevant information
BEFORE generating response
```

Instead of relying only on model training.

---

# 2. Why RAG Exists

LLMs have problems:

- hallucinations
- outdated knowledge
- no private data access
- limited context

RAG solves this by injecting external knowledge.

---

# 3. Core RAG Flow

```text id="r2"
User Question
 ↓
Embedding
 ↓
Vector Search
 ↓
Relevant Chunks
 ↓
Inject into Prompt
 ↓
LLM Generates Answer
```

This is THE foundational architecture.

---

# 4. Important Mental Model

LLM = reasoning engine

Retriever = knowledge engine

Together:

- powerful AI systems

---

# 5. Full RAG Architecture

```text id="r3"
Documents
 ↓
Loaders
 ↓
Text Splitters
 ↓
Embeddings
 ↓
MemoryVectorStore
 ↓
Retriever
 ↓
Prompt
 ↓
LLM
 ↓
Answer
```

You already learned most components individually.

Now we connect everything.

---

# 6. Main RAG Components

| Component    | Purpose               |
| ------------ | --------------------- |
| Loader       | Load documents        |
| Splitter     | Chunk documents       |
| Embeddings   | Convert to vectors    |
| Vector Store | Store vectors         |
| Retriever    | Fetch relevant chunks |
| Prompt       | Inject context        |
| LLM          | Generate answer       |

---

# 7. Why We Use MemoryVectorStore First

We are starting with:

# MemoryVectorStore

Why?

- no external database needed
- no server setup
- works fully in memory
- simple for learning
- perfect for understanding retrieval

Unlike Chroma, it does not require a running database server.

This makes it ideal for learning RAG before moving to production vector databases.

---

# 8. Install Required Packages

```bash id="r4"
npm install @langchain/community
npm install @langchain/textsplitters
npm install pdf-parse
```

---

# 9. Document Loaders (https://docs.langchain.com/oss/javascript/integrations/document_loaders)

Load external data.

---

# Popular Loaders

| Loader          | Purpose             |
| --------------- | ------------------- |
| PDFLoader       | PDFs                |
| TextLoader      | Text files          |
| CSVLoader       | CSV                 |
| WebBaseLoader   | Websites            |
| DirectoryLoader | Folders             |
| YouTubeLoader   | YouTube transcripts |

---

# 10. PDF Loader Example

```ts id="r6"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("./07-rag/docs/resume.pdf");

const docs = await loader.load();

console.log(docs);
```

---

# 11. What is Returned?

Array of Documents.

Structure:

```ts id="r7"
{
  pageContent: string,
  metadata: {}
}
```

VERY important.

---

# 12. Text Splitting (CRITICAL) (https://docs.langchain.com/oss/javascript/integrations/splitters)

Never embed huge documents directly.

Instead:

```text id="r8"
Document
 ↓
Chunks
 ↓
Embeddings
```

Chunking is ESSENTIAL.

---

# 13. RecursiveCharacterTextSplitter

Most commonly used splitter.

---

# Example

```ts id="r9"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
```

---

# 14. Why Chunk Overlap Matters

Without overlap:

```text id="r10"
Important context may split apart
```

Overlap preserves continuity.

Very important production detail.

---

# 15. Splitting Documents

```ts id="r11"
const splitDocs = await splitter.splitDocuments(docs);
```

Now:

- large docs → smaller chunks

---

# 16. Typical Chunk Sizes

| Use Case            | Chunk Size     |
| ------------------- | -------------- |
| Small QA            | 300–500        |
| General RAG         | 500–1000       |
| Long-context models | 1000–2000      |
| Code                | Smaller chunks |

No universal perfect value.

---

# 17. Creating Vector Store

```ts id="r12"
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings,
);
```

No external DB required.

Everything runs in memory.

---

# 18. Convert to Retriever

```ts id="r13"
const retriever = vectorStore.asRetriever();
```

Retriever becomes reusable.

This abstraction is extremely important.

---

# 19. Retrieval

```ts id="r14"
const docs = await retriever.invoke("What are React hooks?");
```

Returns:

- semantically relevant chunks

---

# 20. Prompt Injection into LLM

Core RAG concept.

---

# Example Prompt

```text id="r15"
Use the following context
to answer the question.

Context:
{context}

Question:
{question}
```

This grounds the model.

---

# 21. Full RAG Example

```ts id="r16"
import "dotenv/config";

import { ChatGroq } from "@langchain/groq";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";

async function main() {
  // Load PDF
  const loader = new PDFLoader("./07-rag/docs/resume.pdf");

  const docs = await loader.load();

  // Split docs
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  // Embeddings
  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
  });

  // Vector Store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
  );

  // Retriever
  const retriever = vectorStore.asRetriever();

  // Retrieve docs
  const retrievedDocs = await retriever.invoke("What are hooks?");

  // Join context
  const context = retrievedDocs.map((doc) => doc.pageContent).join("\n\n");

  // Prompt
  const prompt = ChatPromptTemplate.fromTemplate(`
Use the following context
to answer the question.

Context:
{context}

Question:
{question}
`);

  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
  });

  const parser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    context,
    question: "Explain React hooks",
  });

  console.log(response);
}

main();
```

---

# 22. This is REAL AI Engineering

You now combined:

- loaders
- chunking
- embeddings
- vector store
- retriever
- prompt templates
- LCEL
- LLMs

This is a full AI system.

---

# 23. Why RAG Reduces Hallucinations

Without RAG:

- model guesses

With RAG:

- model uses retrieved evidence

This massively improves accuracy.

---

# 24. Important Limitation

RAG does NOT magically guarantee truth.

Bad retrieval:

- bad answers

Garbage retrieval:

- garbage generation

Retrieval quality matters more than most people realize.

---

# 25. Common RAG Problems

| Problem              | Meaning        |
| -------------------- | -------------- |
| Poor chunking        | Lost context   |
| Bad embeddings       | Weak retrieval |
| Irrelevant retrieval | Wrong answers  |
| Too much context     | Confused model |
| Missing metadata     | Bad filtering  |

---

# 26. Metadata in RAG

VERY important.

Example:

```json id="r17"
{
  "source": "react-docs",
  "page": 3,
  "topic": "hooks"
}
```

Useful for:

- citations
- filtering
- debugging

---

# 27. Retriever Search Types

Different retrieval strategies.

---

## Similarity Search

Most common.

---

## MMR (VERY IMPORTANT)

MMR = Maximum Marginal Relevance

Balances:

- relevance
- diversity

---

# Example

```ts id="r18"
const retriever = vectorStore.asRetriever({
  searchType: "mmr",
  k: 4,
});
```

Very useful in production RAG.

---

# 28. Top-K Retrieval

Retrieve:

- top K chunks

Example:

```ts id="r19"
k: 4;
```

Too small:

- missing context

Too large:

- noisy context

Critical tuning parameter.

---

# 29. similaritySearchWithScore()

Very useful for debugging retrieval.

```ts id="r20"
const results = await vectorStore.similaritySearchWithScore("React hooks", 3);
```

Used for:

- ranking
- thresholds
- debugging
- filtering weak matches

---

# 30. Context Window Awareness

LLMs have token limits.

Too much context:

- expensive
- slower
- sometimes worse quality

Good retrieval is about precision.

Not just “more context”.

---

# 31. Hybrid Search (Production Concept)

Modern production RAG often combines:

```text id="r21"
Keyword Search
+
Semantic Search
```

This improves:

- exact matches
- semantic matches

Very powerful.

---

# 32. Real Production RAG Stack

Typical architecture:

```text id="r22"
Frontend
 ↓
API
 ↓
Retriever
 ↓
Prompt
 ↓
LLM
 ↓
Streaming Response
```

---

# 33. RAG vs Fine-Tuning

VERY important distinction.

| RAG                | Fine-Tuning          |
| ------------------ | -------------------- |
| External knowledge | Model training       |
| Easy updates       | Expensive retraining |
| Dynamic            | Static               |
| Most enterprise AI | Specialized tasks    |

Most companies prefer RAG.

---

# 34. Recommended Folder Structure

```text id="r23"
07-rag/
 ├── src/
 │   ├── loaders.ts
 │   ├── splitters.ts
 │   ├── embeddings.ts
 │   ├── vectorstore.ts
 │   ├── retriever.ts
 │   ├── basic-rag.ts
 │   ├── mmr.ts
 │   └── metadata.ts
```

---

# 35. Important Modern Insight

Modern AI apps are increasingly:

```text id="r24"
Retrieval-first systems
```

Not purely model-first systems.

Huge mindset shift.

---

# 36. What You Learned

You now understand:

- RAG architecture
- loaders
- chunking
- retrieval
- retrievers
- prompt grounding
- MMR
- metadata
- similarity scores
- hallucination reduction

You now understand the architecture behind MOST modern AI products.

---

# 37. Next Topic

# Tools

This is where AI becomes capable of ACTIONS.

You’ll learn:

- tool calling
- schemas
- Zod validation
- custom tools
- tool execution
- AI actions
- function calling
- agent foundations

This is where things become REALLY exciting.
