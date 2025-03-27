import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/404.html',  // This is the file you want to copy
          dest: '',  // Root of the dist folder
        },
      ],
    }),
  ],
  base: '/',  // Use '/' if deploying to the root of the domain
})
