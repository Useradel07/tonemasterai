import Groq from "groq-sdk";

export default async function handler(req, res) {
  // 1. Setup CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 2. Safety Wrap - CATCH ALL ERRORS
  try {
    // Check if Key exists
    if (!process.env.GROQ_API_KEY) {
      throw new Error("CRITICAL: GROQ_API_KEY is missing from process.env");
    }

    // Try to initialize Groq
    let groq;
    try {
      groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } catch (err) {
      throw new Error(`Failed to initialize Groq SDK: ${err.message}`);
    }

    const { prompt } = req.body;
    if (!prompt) throw new Error("No 'prompt' found in request body.");

    // 3. Simple Request (No Streaming for Debugging)
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
    });

    const result = completion.choices[0]?.message?.content || "No content returned";
    
    // Success
    return res.status(200).json({ result: result });

  } catch (error) {
    console.error("DEBUG ERROR:", error);
    // 4. RETURN THE ERROR TO THE FRONTEND
    // Instead of 500, we send 200 with the error details so you can read it.
    return res.status(200).json({ 
      result: `⚠️ SYSTEM ERROR: ${error.message}`,
      isError: true 
    });
  }
}
