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
          src: 'index.html', // Copy index.html from the root
          dest: '404.html', // Place the copy inside public as 404.html
        },
      ],
    }),
  ],
  base: '/',
})
