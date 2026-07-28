import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Ai_meeting_assistant/',
  plugins: [react()],
  server: {
    // Proxy API requests to local AI servers to avoid CORS issues
    proxy: {
      // Proxy for OpenAI-compatible endpoints (LM Studio default)
      '/lmstudio': {
        target: 'http://127.0.0.1:1234',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lmstudio/, ''),
      },
      // Proxy for Ollama endpoints
      '/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
      },
    },
  },
})
