import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Feature-Sliced Design layer boundaries.
 *
 * Layers may only depend on layers *below* them:
 *   app → pages → widgets → features → entities → shared
 *
 * Each zone forbids a target layer from importing anything located in a
 * higher layer, so the dependency graph can only ever point downwards.
 */
const FSD_LAYERS = ['shared', 'entities', 'features', 'widgets', 'pages', 'app'];

const fsdBoundaryZones = FSD_LAYERS.flatMap((layer, index) => {
  const higherLayers = FSD_LAYERS.slice(index + 1);
  if (higherLayers.length === 0) return [];

  return [
    {
      target: `./src/${layer}`,
      from: higherLayers.map((higher) => `./src/${higher}`),
      message: `FSD violation: "${layer}" must not import from a higher layer (${higherLayers.join(', ')}).`,
    },
  ];
});

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },

  // Base JS/TS rules.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-x': importX,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      'import-x/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // FSD architecture boundaries.
      'import-x/no-restricted-paths': ['error', { zones: fsdBoundaryZones }],

      // Consistent, readable imports.
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Test files: relax type-checking noise for expressive test code.
  {
    files: ['**/*.test.{ts,tsx}', '**/test/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      // `act()` returns a thenable even for synchronous updates.
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // Node-side config files.
  {
    files: ['*.{js,ts}', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
  },

  // Prettier must come last to disable conflicting stylistic rules.
  prettier,
);
