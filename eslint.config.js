import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const typescriptRecommendedRules = tseslint.configs.recommended.reduce(
  (rules, config) => ({ ...rules, ...(config.rules ?? {}) }),
  {},
)

export default [
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescriptRecommendedRules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,
    },
  },
]
