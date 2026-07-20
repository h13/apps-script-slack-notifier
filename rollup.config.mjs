import cleanup from 'rollup-plugin-cleanup';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [cleanup({ comments: 'none', extensions: ['.ts'] }), esbuild()],
  context: 'this',
};
