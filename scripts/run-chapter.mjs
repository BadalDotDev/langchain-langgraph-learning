import { spawn } from "node:child_process";

const chapter = process.argv[2];
const file = process.argv[3];

if (!chapter || !file) {
  console.log("Usage:");
  console.log("npm run chapter-1 -- basic.ts");
  process.exit(1);
}

const child = spawn("npx", ["tsx", `${chapter}/${file}`], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code);
});
