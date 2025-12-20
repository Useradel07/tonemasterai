// pages/api/generate.js
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
    const { prompt, tone, language, platform } = req.body; // Expecting structured body now

    if (!prompt) throw new Error("No prompt provided");

    // --- PRO PROMPT ENGINEERING ---
    // We construct a specific persona to ensure high-quality, human-like output.
    
    const systemInstruction = `
      You are an expert copywriter and editor with a talent for human-sounding communication.
      
      CORE RULES:
      1. NO AI CLICHÉS: Avoid words like "delve", "tapestry", "landscape", "testament", "realm".
      2. BE DIRECT: Cut fluff. meaningful sentences only.
      3. TONE: You must strictly adhere to the requested tone: ${tone}.
      4. LANGUAGE: Output strictly in ${language}.
      5. FORMAT: ${platform === 'linkedin' ? 'Use short punchy lines, line breaks, and 3 hashtags.' 
         : platform === 'email' ? 'Format as a clear, professional email.' 
         : platform === 'twitter' ? 'Keep it under 280 characters, punchy.' 
         : 'Standard clear paragraphs.'}
      
      Your goal is to rewrite the user's text to be better, clearer, and impactful.
      Do not explain what you did. Just give the rewritten text.
    `;

    const userMessage = `Original Text to Rewrite:\n"${prompt}"`;

    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile", 
      stream: true,
      temperature: 0.6, // Slightly lower for more focused writing
      max_tokens: 1024,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) res.write(content);
    }

    res.end();

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
}