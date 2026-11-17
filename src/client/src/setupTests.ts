import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent('react');
// learn more: https://github.com/testing-library/jest-dom
// Registered through the standalone matchers (the package's own /vitest
// entry sits hoisted at the workspace root and cannot resolve 'vitest'
// there); the matcher types come from src/jest-dom-vitest.d.ts.
expect.extend(matchers);

// The CRA-era fixes here (testEnvironment.js + the __nodeWebApis restore)
// existed only to undo react-app-polyfill's whatwg-fetch install. Vitest's
// jsdom environment keeps Node's native fetch/streams/TextEncoder globals,
// which is what msw 2 needs, so they are gone (issue #18).

console.error = vi.fn();
console.warn = vi.fn();
