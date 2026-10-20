import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import {cellReviewPlugin} from './scripts/academic/cell-review-plugin.mjs'

export default defineConfig(({mode, command}) => {
  if (mode === 'emulator' && command !== 'serve') {
    throw new Error('Emulator mode is development-only and cannot be built for deployment.')
  }
  return {
    plugins: [react(), tailwindcss(),cellReviewPlugin(mode,command)].filter(Boolean),
    build: {manifest: true},
    server: mode === 'emulator' ? {
      host: '127.0.0.1', port: 5174, strictPort: true,
      // A second barrier: SDK fetch/XHR cannot reach live Firebase endpoints.
      headers: {'Content-Security-Policy': "connect-src 'self' http://127.0.0.1:9099 http://127.0.0.1:8080 ws://127.0.0.1:5174"},
    } : {host: '0.0.0.0'},
  }
})
