import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // Common
      'no-useless-catch': 'off',
      'no-console': 'warn',
      'no-extra-boolean-cast': 'off',
      'no-lonely-if': 'warn',
      'no-unused-vars': 'warn',
      'no-trailing-spaces': 'warn',
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': 'warn',

      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      indent: ['warn', 2],
      semi: ['warn', 'never'],
      quotes: ['error', 'single'],
      'array-bracket-spacing': ['warn', 'never'],
      'linebreak-style': 'off',
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': 'warn',
      'comma-dangle': 'warn',
      'comma-spacing': 'warn',
      'arrow-spacing': 'warn'
    }
  },

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ])
])

export default eslintConfig