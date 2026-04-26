import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { obfuscatorPlugin } from './vite.plugins'

export default defineConfig({
  main: {
    plugins: [obfuscatorPlugin()]
  },
  preload: {
    plugins: [obfuscatorPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      obfuscatorPlugin()
    ]
  }
})
