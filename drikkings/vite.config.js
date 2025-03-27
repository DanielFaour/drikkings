import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/index.html',
          dest: '404.html', // Make a copy of index.html as 404.html
        },
      ],
    }),
  ],
  base: '/',
})
