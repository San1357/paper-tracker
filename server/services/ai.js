import { GoogleGenAI } from "@google/genai";

let client;
const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY .env mein set nahi hai");
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
};

// .env se models ki list: "model-a,model-b" → ["model-a", "model-b"]
const getModels = () =>
  (process.env.GEMINI_MODEL || "gemini-2.5-flash")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const summarizePaper = async ({ title, abstract }) => {
  const prompt = `You are helping a student quickly understand a research paper.

Title: ${title}

Abstract:
${abstract}

Write a short summary in simple English using exactly this format:

Main idea: <1-2 sentences>

Key contributions:
- <point>
- <point>
- <point>

Why it matters: <1 sentence>

Use only the information in the abstract. Do not invent results or numbers.`;

  let lastError;

  for (const model of getModels()) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await getClient().models.generateContent({ model, contents: prompt });
        const text = response.text?.trim();
        if (!text) throw new Error("AI ne khaali jawab diya");
        return text;
      } catch (err) {
        lastError = err;
        console.warn(`AI: ${model} attempt ${attempt} fail (${err.status || err.message})`);

        // 500/503 = model busy → thoda ruk ke isi model pe dobara
        if (err.status === 500 || err.status === 503) {
          await sleep(1500 * attempt);
          continue;
        }
        // 404 = model nahi mila, 429 = is model ki limit khatam → agla model
        if (err.status === 404 || err.status === 429) break;

        // Baaki errors (galat key waghera) → retry ka fayda nahi
        throw err;
      }
    }
  }

  throw lastError;
};