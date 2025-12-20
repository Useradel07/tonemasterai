# 👔 ToneMaster AI

**ToneMaster AI** is a professional text rewriting tool powered by **Groq** and the **Llama 3** model. It helps users instantly rewrite emails, essays, and messages into specific tones (Corporate, Empathetic, Legal, Gen-Z, etc.) and formats (Email, LinkedIn, Slack, etc.).

Built with **React**, **Tailwind CSS**, and **Vercel Serverless Functions** for a secure, ultra-fast streaming experience.

## ✨ Features

- **Tone Transformation**: Rewrite text into 6+ distinct tones (Corporate, Legal, Empathetic, etc.).
- **Platform Formatting**: Auto-format for specific platforms like LinkedIn (with hashtags), Email (Subject/Body), or Slack.
- **Real-Time Streaming**: Text appears instantly using Vercel Edge streaming and Groq's high-speed inference.
- **Multi-Language Support**: UI and Rewriting support for English, French, and Arabic (RTL support included).
- **History Management**: Automatically saves recent rewrites to local storage.
- **Secure Backend**: API keys are protected server-side; no exposure to the browser.
- **Dark Mode**: Fully responsive dark/light mode UI.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Framer Motion (Animations), Lucide React (Icons).
- **Styling**: Tailwind CSS.
- **AI Model**: Llama 3 70B (via `groq-sdk`).
- **Backend**: Vercel Serverless Functions (Node.js).
- **Deployment**: Vercel.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A [Groq Cloud](https://console.groq.com/) account and API Key.
- A [Vercel](https://vercel.com) account.

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/tonemaster-ai.git
cd tonemaster-ai
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

### 3. Run Locally

To run both the frontend and the serverless backend locally, use the Vercel CLI (recommended):

```bash
npm i -g vercel
vercel dev
```

Your app should now be running at `http://localhost:3000`.

## 🌐 Deployment

The easiest way to deploy is via **Vercel**.

1.  **Push your code** to a GitHub repository.
2.  **Log in to Vercel** and click "Add New Project".
3.  **Import** your repository.
4.  **Environment Variables**:
    - In the deployment configuration, find the "Environment Variables" section.
    - Add `GROQ_API_KEY` with your actual API key value.
5.  Click **Deploy**.

Vercel will automatically detect the React frontend and the `api/` directory for serverless functions.

## 📂 Project Structure

```
/
├── api/                # Serverless functions (Backend)
│   └── generate.js     # Secure proxy to Groq API with Streaming
├── src/                # Frontend Source
│   ├── components/     # UI Components (ToneSelector, Sidebar, etc.)
│   ├── services/       # Service layers
│   ├── App.tsx         # Main Application Logic
│   ├── types.ts        # TypeScript Interfaces
│   └── constants.ts    # Config for Tones, Languages, etc.
├── public/             # Static assets
└── index.html          # Entry point
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
