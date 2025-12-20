import Groq from "groq-sdk";

export default async function handler(req, res) {
  // 1. Setup CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { prompt } = req.body;

    if (!prompt) throw new Error("No prompt provided");

    // 2. USE THE NEW MODEL
    const stream = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      // ✅ UPDATED MODEL NAME:
      model: "llama-3.3-70b-versatile", 
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    // 3. Stream back to frontend
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(content);
      }
    }

    res.end();

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
}
