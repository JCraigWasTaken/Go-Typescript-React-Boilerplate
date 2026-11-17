// ESLint 9+ flat config (issue #18). Replaces the `eslintConfig` block in
// package.json that relied on eslint-config-react-app, which only exists
// inside react-scripts. Same intent: recommended JS + TypeScript rules plus
// the React hooks/refresh rules CRA gave us.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: ['build/**', 'coverage/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // The rules CRA's eslint-config-react-app enforced (the others in
      // react-hooks 7's recommended set are new rules this code predates).
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // CRA's react-app config did not police `any`; the tests and generated
      // API client use it freely. Kept as a warning so new code can tighten it.
      '@typescript-eslint/no-explicit-any': 'warn',
      // John's 3-file pattern writes `interface IXProps extends IUseXProps {}`;
      // that empty-interface form is the standard, not a mistake.
      '@typescript-eslint/no-empty-object-type': 'off',
      // CRA reported unused vars as warnings, not errors.
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  }
);
