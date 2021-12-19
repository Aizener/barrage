import typescript from 'rollup-plugin-typescript2';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.umd.js',
      name: 'Barrage',
      format: 'umd'
    },
    plugins: [
      typescript(),  // 会自动读取 文件tsconfig.json配置
      babel(),
      uglify()
    ]
  },
  {
    input: './src/index.ts',
    output: {
      file: './dist/index.esm.js',
      format: 'es'
    },
    plugins: [
      typescript(),  // 会自动读取 文件tsconfig.json配置
      babel(),
      uglify()
    ]
  }
]