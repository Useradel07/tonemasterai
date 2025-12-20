import Groq from "groq-sdk";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Initialize Groq with the secure API key from environment variables
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Create a streaming chat completion using Llama 3
    const stream = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: "llama3-70b-8192", // High performance Llama 3 model
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Stream the chunks back to the client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(content);
      }
    }

    res.end();

  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).write("Error generating content.");
    res.end();
  }
}