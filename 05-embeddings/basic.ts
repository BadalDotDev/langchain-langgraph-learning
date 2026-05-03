import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings();

async function main() {
  const vector = await embeddings.embedQuery("What is LangChain?");

  console.log(vector);
  console.log("Dimensions:", vector.length);

  const vectors = await embeddings.embedDocuments([
    "React is a frontend library",
    "Vue is progressive",
    "Next.js is built on React",
  ]);

  console.log(vectors);
  console.log("Total Documents:", vectors.length);
  console.log("Vector Size:", vectors?.[0]?.length);
}

main();
