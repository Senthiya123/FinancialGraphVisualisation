import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Base ESLint setup for JavaScript/TypeScript files
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [
      'assets/**/*',
      'definition/**/*',
      'dist/**/*',
      'docs/**/*',
      'node_modules/**/*',
      '.history/**/*',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      'unused-imports': unusedImports,
      react: pluginReact,
      'react-hooks': reactHooks,
      prettier: prettier,
    },
    rules: {
      // Import rules
      'import/named': 0,
      'import/namespace': 0,
      'import/default': 0,
      'import/no-named-as-default-member': 0,
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['sibling', 'parent'],
            'index',
          ],
          pathGroups: [
            // list @burnsred/ deps as internal
            { pattern: '@burnsred/**', group: 'internal' },

            // define 'root relative' patterns as internal
            { pattern: 'api', group: 'internal' },
            { pattern: 'api/**', group: 'internal' },
            { pattern: 'assets/**', group: 'internal', position: 'after' },
            { pattern: 'components', group: 'internal' },
            { pattern: 'components/**', group: 'internal' },
            { pattern: 'constants', group: 'internal' },
            { pattern: 'constants/**', group: 'internal' },
            { pattern: 'docs', group: 'internal' },
            { pattern: 'docs/**', group: 'internal' },
            { pattern: 'entities', group: 'internal' },
            { pattern: 'entities/**', group: 'internal' },
            { pattern: 'mocks', group: 'internal' },
            { pattern: 'mocks/**', group: 'internal' },
            { pattern: 'screens', group: 'internal' },
            { pattern: 'screens/**', group: 'internal' },
            { pattern: 'settings', group: 'internal' },
            { pattern: 'settings/**', group: 'internal' },
            { pattern: 'setup', group: 'internal' },
            { pattern: 'setup/**', group: 'internal' },
            { pattern: 'test', group: 'internal' },
            { pattern: 'test/**', group: 'internal' },
            { pattern: 'test-e2e/**', group: 'internal' },
            { pattern: 'theme', group: 'internal' },
            { pattern: 'theme/**', group: 'internal' },
            { pattern: 'util', group: 'internal' },
            { pattern: 'util/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],

      // Sort imports within packages
      'sort-imports': [
        'warn',
        {
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // TypeScript ESLint configuration - with specific parser setup
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        // Removing the project reference for now
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // React configurations
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
    },
  },

  // Prettier configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'prettier/prettier': 'warn',
    },
  },
]);
