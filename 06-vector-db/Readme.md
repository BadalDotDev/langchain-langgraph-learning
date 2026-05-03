# Topic 6 — Vector Databases

Now embeddings become actually useful.

Without a vector DB:

```text id="v1"
Vectors exist...
but are useless at scale
```

With vector stores:

```text id="v2"
Store
Search
Retrieve
Filter
Rank
```

This powers:

- RAG
- semantic search
- AI memory
- recommendations
- agent retrieval
- enterprise AI search

---

# 1. What is a Vector Store?

A system optimized for:

- vector storage
- similarity search
- nearest neighbor retrieval

Instead of:

```sql id="v3"
WHERE name = 'React'
```

you do:

```text id="v4"
Find semantically similar vectors
```

---

# 2. Traditional DB vs Vector Store

| Traditional DB  | Vector Store      |
| --------------- | ----------------- |
| Exact matching  | Semantic matching |
| Structured data | Embeddings        |
| SQL queries     | Similarity search |
| B-trees         | ANN indexes       |
| IDs/rows        | Vectors           |

---

# 3. Core Workflow

```text id="v5"
Documents
 ↓
Chunking
 ↓
Embeddings
 ↓
Vector Store
 ↓
Similarity Search
 ↓
Relevant Chunks
```

This is modern RAG architecture.

---

# 4. Why We Use MemoryVectorStore First

We are starting with:

# MemoryVectorStore

Why?

- no external database needed
- no server setup
- easy for learning
- works fully in memory
- perfect for understanding similarity search

Unlike Chroma, it does not require a running database server.

This makes it ideal for beginners.

---

# 5. Install Required Packages

```bash id="v6"
npm install @langchain/community
```

Also make sure your `.env` contains:

```env id="v7"
HUGGINGFACEHUB_API_KEY=your_key_here
```

---

# 6. MemoryVectorStore Mental Model

It stores:

```text id="v8"
{
  pageContent,
  embedding,
  metadata
}
```

Important structure.

Unlike production databases, it is temporary and exists only while your app is running.

---

# 7. Metadata (VERY IMPORTANT)

Metadata enables filtering and better organization.

Example:

```json id="v9"
{
  "id": "1",
  "category": "frontend",
  "source": "react-docs"
}
```

Critical for production RAG.

---

# 8. First Vector Store

```ts id="v10"
import "dotenv/config";

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
```

---

# 9. Create Embeddings

```ts id="v11"
const embeddings = new HuggingFaceInferenceEmbeddings();
```

This generates vector embeddings using Hugging Face inference.

---

# 10. Create Vector Store

```ts id="v12"
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
```

---

# 11. What Happened?

This:

```text id="v13"
Texts
 ↓
Embeddings generated
 ↓
Stored in MemoryVectorStore
```

Now searchable semantically.

---

# 12. Similarity Search

Core operation.

---

# Example

```ts id="v14"
const results = await vectorStore.similaritySearch("frontend framework", 2);

console.log(results);
```

---

# 13. What Does `2` Mean?

```ts id="v15"
similaritySearch(query, k);
```

`k` = number of results.

Example:

- top 2 matches

---

# 14. Why "Dogs are loyal animals" Can Appear

If you ask for:

```ts id="v16"
similaritySearch("frontend framework", 3);
```

and only 2 documents are strongly relevant, the third result may still be:

```text id="v17"
Dogs are loyal animals
```

Why?

Because vector search returns:

# Top-K closest matches

not:

# Only perfect matches

This is expected behavior.

---

# 15. Adding Documents

You can add new documents after creation.

```ts id="v18"
import { Document } from "@langchain/core/documents";

await vectorStore.addDocuments([
  new Document({
    pageContent: "Angular is a frontend framework",
    metadata: {
      id: "4",
      category: "frontend",
    },
  }),
]);
```

---

# 16. After Adding

Now similarity search for:

```text id="v19"
frontend framework
```

will likely return:

- Angular
- React
- Next.js

because Angular matches the query very strongly.

---

# 17. Deleting Documents

Important:

```ts id="v20"
await vectorStore.delete(...)
```

may exist in autocomplete but throws:

```text id="v21"
Error: Not implemented.
```

for many versions of MemoryVectorStore.

So deletion is usually done manually.

---

# 18. Manual Delete

```ts id="v22"
vectorStore.memoryVectors = vectorStore.memoryVectors.filter(
  (doc) => doc.metadata.id !== "2",
);
```

This removes:

```text id="v23"
Next.js uses React
```

from the vector store.

---

# 19. Full Working Example

```ts id="v24"
import "dotenv/config";

import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";

async function main() {
  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
  });

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

  vectorStore.memoryVectors = vectorStore.memoryVectors.filter(
    (doc) => doc.metadata.id !== "2",
  );

  console.log("\n=== After Deleting id=2 ===\n");

  results = await vectorStore.similaritySearch("frontend framework", 4);

  console.log(results);
}

main();
```

---

# 20. similaritySearchWithScore()

Returns:

- document
- similarity score

---

# Example

```ts id="v25"
const results = await vectorStore.similaritySearchWithScore(
  "frontend framework",
  3,
);
```

Very useful for:

- ranking
- debugging
- thresholds
- filtering weak matches

---

# 21. Similarity Scores

Higher score means:

- more relevant match

Used for:

- filtering weak matches
- reranking
- confidence estimation

Very important for real RAG systems.

---

# 22. Retriever Interface (VERY IMPORTANT)

LangChain abstracts vector stores using:

# Retrievers

This is huge.

---

# Convert to Retriever

```ts id="v26"
const retriever = vectorStore.asRetriever();
```

Now it becomes:

- reusable in LCEL
- reusable in RAG chains
- reusable in agents

---

# 23. Using Retriever

```ts id="v27"
const docs = await retriever.invoke("Explain React");
```

This abstraction is extremely important.

---

# 24. Retrieval Pipeline

Modern RAG:

```text id="v28"
User Question
 ↓
Retriever
 ↓
Relevant Documents
 ↓
Prompt
 ↓
LLM
```

Retriever is core infrastructure.

---

# 25. Important Vector Concepts

| Concept           | Meaning                      |
| ----------------- | ---------------------------- |
| Embedding         | Vector representation        |
| Similarity Search | Semantic retrieval           |
| Metadata          | Extra filtering data         |
| Top-K             | Number of results            |
| Retriever         | Standard retrieval interface |
| Score             | Similarity confidence        |

---

# 26. Common Beginner Mistakes

## Mistake 1

❌ Asking for too many results (`k` too large)

This causes unrelated matches like:

```text id="v29"
Dogs are loyal animals
```

---

## Mistake 2

❌ No metadata

Makes filtering difficult later.

---

## Mistake 3

❌ Using delete() directly in MemoryVectorStore

Often throws:

```text id="v30"
Not implemented
```

---

## Mistake 4

❌ Thinking vector search is exact matching

It is ranking-based semantic matching.

---

# 27. Best Practices

## Use Metadata

Always.

---

## Keep Good IDs

Use:

```ts id="v31"
metadata.id;
```

for reliable manual deletion and tracking.

---

## Use Smaller K

Avoid weak matches.

Usually:

```ts id="v32"
k = 2 or 3
```

is better than large values.

---

## Use Scores

Use:

```ts id="v33"
similaritySearchWithScore();
```

for debugging retrieval quality.

---

# 28. Important Modern Insight

Modern AI apps are increasingly becoming:

```text id="v34"
Retrieval Systems
+
LLMs
```

Retrieval quality often matters MORE than model quality.

Huge industry insight.

---

# 29. What You Learned

You now understand:

- vector stores
- MemoryVectorStore
- similarity search
- top-k retrieval
- why weak matches happen
- metadata
- adding documents
- manual deletion
- retrievers
- semantic retrieval

You now have the full foundation required for RAG.

---

# 30. Next Topic (VERY IMPORTANT)

# RAG — Retrieval Augmented Generation

This is where everything comes together.

You’ll learn:

- document loaders
- chunking
- retrieval pipelines
- contextual prompting
- retrievers
- reranking
- hallucination reduction

This is one of the most important AI engineering topics today.
