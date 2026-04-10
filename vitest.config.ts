import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    reporters: ['default', 'json'],
    outputFile: {
      json: './test-results/results.json',
    },
    coverage: {
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './test-results/coverage',
      include: ['src/lib/**', 'src/app/api/**', 'src/components/**'],
      exclude: ['src/components/ui/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
