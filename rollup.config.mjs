import alias from '@rollup/plugin-alias';
import path from 'path';

export default {
  input: './packages/slim-react/src/index.js',
  output: [
    {
      file: './packages/slim-react/dist/slim-react.cjs.js',
      format: 'cjs',
    },
    {
      file: './packages/slim-react/dist/slim-react.esm-bundler.js',
      format: 'es',
    },
    // for example running
    {
      file: './packages/slim-react/example/dist/slim-react.esm-bundler.js',
      format: 'es',
    },
  ],
  plugins: [
    alias({
      entries: [
        { find: /^@slim-react\/(.*)$/, replacement: path.resolve('packages/$1/src/index.js') },
      ]
    })
  ]
}