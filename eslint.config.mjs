import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
  }),
  {
    ignores: [
      '.next/',
      'out/',
      'next-env.d.ts',
      'prettier.config.mjs',
      'eslint.config.mjs',
      'next.config.js',
      'postcss.config.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
]

export default eslintConfig
