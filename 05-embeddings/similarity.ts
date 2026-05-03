import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const embeddings = new HuggingFaceInferenceEmbeddings();

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);

  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));

  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dot / (magA * magB);
}

async function main() {
  const s1 = "Learn JavaScript programming";
  const s2 = "JavaScript tutorial for beginners";

  const v1 = await embeddings.embedQuery(s1);
  const v2 = await embeddings.embedQuery(s2);

  const similarity = cosineSimilarity(v1, v2);

  console.log("Similarity Score:", similarity);
}

main();
