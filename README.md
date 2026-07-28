# 🧠 AI Meeting Assistant

A professional web application that extracts structured action items from meeting transcripts using locally running AI models. All data stays on your machine — private, fast, and professional.

![AI Meeting Assistant](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Tests](https://img.shields.io/badge/Tests-53%20Passing-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue) ![React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple)

## ✨ Features

### Core
- **Transcript Input** — Paste text or upload `.txt`/`.md` files via drag-and-drop
- **AI-Powered Extraction** — Uses local AI models to identify action items, assignees, deadlines, and priorities
- **Structured Task Table** — Clean, sortable table with inline editing
- **Full CRUD** — Add, edit, delete, approve, and complete tasks
- **Multi-Format Export** — CSV, JSON, Markdown, and clipboard copy

### AI Integration
- **Ollama Support** — Native `/api/chat` endpoint (default port 11434)
- **OpenAI-Compatible** — Works with LM Studio, vLLM, and other `/v1/chat/completions` servers
- **Model Selection** — Auto-discovers available models from your local server
- **Temperature Control** — Adjustable creativity slider for extraction precision

### Data Privacy
- Transcript data is sent **only** to your local AI server
- No cloud services, no external API calls, no logging of transcript content
- Settings persisted to localStorage only

### UI/UX
- Premium dark-mode design with glassmorphism effects
- Responsive layout (mobile → desktop)
- Status indicators for connection, processing, success, and error states
- "Needs Review" flags for uncertain AI extractions (never fabricates missing data)
- Toast notifications for feedback
- Sample transcript for quick demos

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js 18+** — [Download](https://nodejs.org/)
2. **A local AI server** — Choose one:
   - [Ollama](https://ollama.ai/) (recommended) — `ollama serve` then `ollama pull llama3.2`
   - [LM Studio](https://lmstudio.ai/) — Download, load a model, enable the server

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Ai_meeting_assistant

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app opens at **http://localhost:5173/**

### Quick Start

1. **Configure AI** — In the sidebar Settings, ensure your AI server URL is correct and click "Test"
2. **Select a Model** — Choose from the auto-populated dropdown
3. **Add Transcript** — Paste text or click "Load Sample" for a demo
4. **Extract** — Click "Extract Action Items" and wait for the AI to analyze
5. **Review & Edit** — Review the extracted tasks, edit as needed, approve or export

---

## 🏗 Architecture

```
src/
├── app/                    # App entry point and shell
├── components/             # Shared UI components (Toast)
├── features/
│   ├── transcript/         # Transcript input (paste/upload)
│   ├── tasks/              # Task table, rows, editor, export
│   └── settings/           # AI server configuration
├── lib/
│   ├── ai-client.ts        # Ollama / OpenAI API client
│   ├── prompt.ts           # System prompt engineering
│   ├── export.ts           # CSV, JSON, Markdown serializers
│   └── schemas.ts          # Zod validation for AI responses
├── stores/
│   ├── taskStore.ts        # Zustand task state
│   └── settingsStore.ts    # Zustand settings (persisted)
├── types/                  # Shared TypeScript interfaces
├── data/                   # Sample transcript
├── test/                   # All tests (6 test suites)
└── index.css               # Design system + global styles
```

### Tech Stack

| Layer | Technology |
|:---|:---|
| Build | Vite 8 |
| UI | React 19 + TypeScript 6 |
| Styling | Vanilla CSS (custom properties) |
| State | Zustand 5 |
| Validation | Zod 4 |
| Icons | Lucide React |
| Testing | Vitest + React Testing Library |

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch
```

**53 tests** across 6 test suites:

| Suite | Tests | Coverage |
|:---|:---|:---|
| `schemas.test.ts` | 11 | Zod validation, AI response parsing |
| `export.test.ts` | 11 | CSV, JSON, Markdown output |
| `taskStore.test.ts` | 9 | Zustand CRUD operations |
| `ai-client.test.ts` | 9 | Connection, model fetch, errors |
| `TaskTable.test.tsx` | 7 | Component rendering, interactions |
| `TranscriptInput.test.tsx` | 6 | Input, upload, sample loading |

---

## 📦 Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Design System

The UI uses a premium dark-mode design with:
- **Color Palette** — Deep navy backgrounds, violet primary, teal secondary
- **Glassmorphism** — Frosted glass cards with backdrop blur
- **Typography** — Inter font with fluid sizing scale
- **Spacing** — 4px grid system via CSS custom properties
- **Animations** — Smooth transitions, pulse effects, slide-in toasts

---

## 📄 License

MIT
