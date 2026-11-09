
/// <reference types="vitest/config" />

import {
  defineConfig,
  loadEnv,
} from 'vite'

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')

  const backendTarget =
    env.API_PROXY_TARGET || 'http://localhost:3000'

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },

    test: {
      // Keep Node as the default for API tests
      environment: 'node',

      // Include both TypeScript and React tests
      include: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
      ],

      clearMocks: true,
    },
  }
})
