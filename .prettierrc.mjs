/**
 * @type {import("prettier").Config}
 */
const prettierConfig = {
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  semi: false,
  singleQuote: true,
  importOrder: ['^\\.\\./', '^\\./'],
  importOrderSortSpecifiers: true,
}

export default prettierConfig
