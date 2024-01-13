import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `
      /**@jsx SlimReact.createElement */
      import SlimReact from 'slim-react'
    `
  }
})