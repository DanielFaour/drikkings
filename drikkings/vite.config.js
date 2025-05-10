import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/404.html',
          dest: '',
        },
      ],
    }),
  ],
  base: '/', // if deploying to root domain
})
