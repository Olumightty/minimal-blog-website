import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  { files: ['**/*.js'], languageOptions: { sourceType: 'module' } },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.js'],
    plugins: { js, eslintPluginPrettier },
    extends: ['js/recommended'],
    rules: {
      ...eslintConfigPrettier.rules,
      'eslintPluginPrettier/prettier': ['error'],
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    plugins: { tseslint, eslintPluginPrettier },
    extends: ['tseslint/recommended'],
    rules: {
      ...eslintConfigPrettier.rules,
      ...tseslint.configs.recommended.rules,
      'eslintPluginPrettier/prettier': ['error'],
    },
  },
]);
