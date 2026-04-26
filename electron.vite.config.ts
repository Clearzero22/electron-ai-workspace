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
        '@': resolve('src/renderer/src'),
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@utils': resolve('src/renderer/src/utils'),
        '@types': resolve('src/renderer/src/types'),
        '@constants': resolve('src/renderer/src/constants'),
        '@assets': resolve('src/renderer/src/assets'),
        '@pages': resolve('src/renderer/src/pages'),
        '@services': resolve('src/renderer/src/services')
      }
    },
    plugins: [
      react(),
      obfuscatorPlugin()
    ]
  }
})
