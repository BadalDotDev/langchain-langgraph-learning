# Topic 5 — Embeddings

This is where AI stops matching keywords and starts understanding meaning.

Embeddings are the foundation of:

- RAG
- semantic search
- memory systems
- recommendation engines
- retrieval
- AI search
- vector databases

Modern AI applications heavily depend on embeddings.

---

# 1. What is an Embedding?

An embedding is a vector representation of data.

Text becomes numbers.

Example:

```text
"I love programming"
```

becomes:

```text
[0.123, -0.882, 0.441, ...]
```

These numbers capture semantic meaning.

---

# 2. Why Embeddings Matter

Traditional search:

```text
Keyword matching
```

Embedding search:

```text
Meaning matching
```

Example:

```text
"How to lose weight"
```

can match:

```text
"Best exercises for fat loss"
```

even without shared keywords.

This is huge.

---

# 3. Core Mental Model

Embeddings place similar meanings close together in vector space.

```text
Dog → close to puppy
Cat → close to kitten
React → close to frontend
```

Semantic relationships become mathematical distances.

---

# 4. Embedding Workflow

Modern embedding pipeline:

```text
Text
 ↓
Embedding Model
 ↓
Vector
 ↓
Vector Database
 ↓
Similarity Search
```

---

# 5. Installing Packages

We will use Hugging Face Inference Embeddings.

## Install

```bash
npm install @langchain/community dotenv
npm install -D typescript tsx @types/node
```

---

# 6. Environment Setup

Create `.env`

```env
HUGGINGFACEHUB_API_KEY=your_huggingface_api_key
```

You can get your API key from Hugging Face.

---

# 7. Basic Embedding Setup

We will use:

```ts
import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings();
```

This uses Hugging Face hosted embedding models instead of local `hf_transformers`.

---

# 8. Generate Single Embedding

Use `embedQuery()` for user queries.

```ts
import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings();

async function main() {
  const vector = await embeddings.embedQuery("What is LangChain?");

  console.log(vector);
  console.log("Dimensions:", vector.length);
}

main();
```

Example output:

```text
Dimensions: 768
```

(Dimensions may vary depending on the provider/model)

---

# 9. embedQuery vs embedDocuments

Very important distinction.

---

## embedQuery()

Used for:

- user search queries

Example:

```ts
await embeddings.embedQuery("What is React?");
```

---

## embedDocuments()

Used for:

- documents
- chunks
- stored knowledge

Example:

```ts
await embeddings.embedDocuments([
  "React is a frontend library",
  "Vue is progressive",
]);
```

---

# 10. Why Separate Methods Exist

Some embedding models optimize differently for:

- queries
- documents

This becomes very important in RAG systems.

---

# 11. embedDocuments Example

```ts
import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings();

async function main() {
  const vectors = await embeddings.embedDocuments([
    "What is LangChain?",
    "How does LangChain work?",
  ]);

  console.log(vectors);
  console.log("Total Documents:", vectors.length);
  console.log("Vector Size:", vectors[0].length);
}

main();
```

---

# 12. Similarity Search Concept

Embedding vectors enable:

```text
distance(vectorA, vectorB)
```

Smaller distance means:

- more semantically similar

---

# 13. Cosine Similarity

Most common similarity metric.

Measures:

- angle between vectors

Formula:

\cos(\theta)=\frac{A\cdot B}{|A||B|}

---

# 14. Similarity Example

```text
"JavaScript tutorial"
```

will be close to:

```text
"Learn JS programming"
```

But far from:

```text
"Best pizza recipes"
```

---

# 15. Cosine Similarity Code Example

```ts
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vector dimensions must match");
  }

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);

  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));

  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dot / (magA * magB);
}
```

This is the recommended production-safe version.

---

# 16. Mini Semantic Search Example

```ts
const docs = [
  "React is used for frontend UI",
  "Cats love sleeping",
  "Next.js is great for web apps",
];
```

Query:

```text
frontend development
```

Expected retrieval:

- React
- Next.js

Not:

- Cats

This is semantic understanding.

---

# 17. Chunk Embeddings

In RAG:

```text
PDF
 ↓
Chunks
 ↓
Embeddings
 ↓
Vector DB
```

Do NOT embed an entire PDF as one vector.

Always split into chunks first.

This is critical.

---

# 18. Simple Chunking Example

```ts
const article = `
LangChain helps developers build AI applications using LLMs.
It supports chains, agents, tools, memory, and retrieval.
Embeddings help in semantic search and RAG systems.
`;

function chunkText(text: string, size = 60) {
  const chunks = [];

  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
}

console.log(chunkText(article));
```

---

# 19. Use Cases

| Use Case        | Description             |
| --------------- | ----------------------- |
| Semantic Search | Meaning-based retrieval |
| RAG             | Retrieval for LLMs      |
| Recommendations | Similar content         |
| Classification  | Semantic grouping       |
| Clustering      | Group similar items     |
| Deduplication   | Detect duplicates       |
| Memory Systems  | AI memory               |
| Hybrid Search   | Vector + keyword search |

---

# 20. Important Production Insight

Embedding quality matters massively.

Bad embeddings:

- poor retrieval
- irrelevant context
- hallucinations

Good embeddings:

- accurate RAG
- strong search

---

# 21. Hybrid Search

Modern systems combine:

```text
Keyword Search
+
Embedding Search
```

This is called:

- Hybrid Retrieval

Very powerful.

---

# 22. Vector Databases

Embeddings are stored inside:

- Chroma
- Pinecone
- Qdrant
- Weaviate

Next topic will cover vector databases in depth.

---

# 23. Recommended Folder Structure

```text
05-embeddings/
├── package.json
├── tsconfig.json
├── .env
└── src/
    ├── basic.ts
    ├── query.ts
    ├── documents.ts
    ├── similarity.ts
    ├── chunking.ts
    ├── exercise1.ts
    ├── exercise2.ts
    ├── exercise3.ts
    └── exercise4.ts
```

---

# 25. Fundamental Modern Insight

Modern AI systems are:

```text
LLMs for generation
Embeddings for retrieval
```

This distinction is fundamental.

---

# 26. What You Learned

You now understand:

- embeddings
- vector representations
- semantic search
- cosine similarity
- embedQuery()
- embedDocuments()
- chunk embeddings
- retrieval foundations

This is the foundation of all RAG systems.

---

# 27. Next Topic

# Vector Databases

Next we learn:

- Chroma
- vector storage
- similarity search
- indexing
- metadata filtering
- retrieval
- ANN search
- semantic querying

This is where embeddings become truly useful.
