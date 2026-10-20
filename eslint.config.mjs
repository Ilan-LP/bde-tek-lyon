import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Shared config for the whole monorepo. Each app lints with `eslint .`
// and picks this file up automatically.
export default defineConfig(
  globalIgnores(['**/dist/', '**/node_modules/', 'apps/api/src/generated/']),
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  {
    files: ['apps/api/**/*.ts', '*.mjs', 'apps/*/*.config.{ts,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
  },
  // Must stay last: turns off rules that conflict with Prettier.
  prettierConfig,
);
