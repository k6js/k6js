// @ts-check

// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'


export default tseslint.config(
  {
    ignores: [
      '**/.keystone/',
      '**/.next/',
      '**/dist/',
      '**/__generated__/',
      '**/node_modules/',
      '**/syntax-error.js',
      '**/public/',
      'examples/',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  reactHooks.configs['recommended-latest'],
  //    ...tseslint.configs.stylistic,
  {
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': 'off',
      'no-extra-boolean-cast': 'off',
      'no-async-promise-executor': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'no-regex-spaces': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'import/no-unresolved': 'off',

      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      'func-call-spacing': ['error', 'never'],
      'no-undef': 'off', // https://typescript-eslint.io/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  }
)
