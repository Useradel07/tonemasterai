# 👔 ToneMaster AI

**ToneMaster AI** is a professional text rewriting tool powered by **Groq** and the **Llama 3** model. It helps users instantly rewrite emails, essays, and messages into specific tones (Corporate, Legal, Empathetic, Casual, Formal, and more).

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

### **Frontend Framework & Languages**
- **React** (v18.2.0) - UI library for building interactive user interfaces
- **TypeScript** (v5.3.3) - Static typing for JavaScript
- **HTML5 & CSS3** - Markup and base styling

### **Build & Development Tools**
- **Vite** (v5.1.0) - Modern frontend build tool for fast development and optimized production builds
- **@vitejs/plugin-react** (v4.2.1) - React integration plugin for Vite
- **ESLint** - Code quality and linting
- **Node.js** (v18+) - JavaScript runtime environment

### **Styling & UI Components**
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework for rapid UI development
- **PostCSS** (v8.4.35) - CSS transformation tool
- **Autoprefixer** (v10.4.17) - Automatically adds vendor prefixes to CSS
- **tailwind-merge** (v2.2.1) - Utility for merging Tailwind CSS classes
- **clsx** (v2.1.0) - Utility for constructing className strings conditionally

### **UI & Animation**
- **Framer Motion** (v11.0.0) - Modern animation library for smooth, intuitive motion
- **Lucide React** (v0.344.0) - Beautiful, consistent React icon library

### **AI & LLM Integration**
- **groq-sdk** (v0.3.3) - Official SDK for Groq Cloud API integration
- **Llama 3 70B** - Large language model for text rewriting via Groq API

### **Backend & Deployment**
- **Vercel Serverless Functions** - Node.js-based serverless backend (deployed via `api/` directory)
- **Vercel** - Full-stack deployment platform
- **@vercel/analytics** (v1.6.1) - Analytics integration for tracking user interactions

### **Development Dependencies**
- **@types/node** (v20.11.0) - TypeScript definitions for Node.js
- **@types/react** (v18.2.55) - TypeScript definitions for React
- **@types/react-dom** (v18.2.19) - TypeScript definitions for React DOM

### **Language Composition**
- **TypeScript**: 39,740 bytes (71%) - Primary language for type-safe development
- **HTML**: 5,023 bytes (9%) - Markup structure
- **JavaScript**: 3,045 bytes (5%) - Additional scripting
- **CSS**: 188 bytes (0.3%) - Additional styling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- A [Groq Cloud](https://console.groq.com/) account and API Key
- A [Vercel](https://vercel.com) account

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

Alternatively, for frontend-only development with Vite:

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployment

The easiest way to deploy is via **Vercel**.

1. **Push your code** to a GitHub repository.
2. **Log in to Vercel** and click "Add New Project".
3. **Import** your repository.
4. **Environment Variables**:
   - In the deployment configuration, find the "Environment Variables" section.
   - Add `GROQ_API_KEY` with your actual API key value.
5. Click **Deploy**.

Vercel will automatically detect the React frontend and the `api/` directory for serverless functions.

## 📂 Project Structure

```
/
├── api/                    # Serverless functions (Backend)
│   └── generate.js         # Secure proxy to Groq API with Streaming
├── src/                    # Frontend Source (React + TypeScript)
│   ├── components/         # Reusable UI Components (ToneSelector, Sidebar, etc.)
│   ├── services/           # Service layers for API communication
│   ├── App.tsx             # Main Application Logic
│   ├── types.ts            # TypeScript Interfaces & Type Definitions
│   ├── constants.ts        # Configuration for Tones, Languages, UI strings
│   └── index.tsx           # React entry point
├── public/                 # Static assets
├── index.html              # HTML entry point
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS customization
├── postcss.config.js       # PostCSS configuration
└── .env                    # Environment variables (not in version control)
```

## 🔑 Key Technologies Explained

- **Groq API**: Provides fast LLM inference with the Llama 3 model, enabling real-time text rewriting.
- **Vercel Serverless**: Securely handles API key management and communicates with Groq on the backend.
- **Streaming Response**: Uses Vercel's streaming capabilities to provide instant, progressive text output to users.
- **Tailwind CSS**: Provides a modern, responsive design without writing custom CSS.
- **Framer Motion**: Creates smooth animations for enhanced user experience.

## 📝 Available Scripts

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

**Made with ❤️ using Groq, React, and Vercel**
