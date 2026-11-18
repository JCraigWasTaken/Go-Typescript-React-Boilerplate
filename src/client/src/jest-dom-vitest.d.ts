// Type bridge for @testing-library/jest-dom under Vitest 5 (issue #18).
// The shipped `@testing-library/jest-dom/vitest` augmentation targets the
// Vitest <= 4 Assertion signature `Assertion<T>`; Vitest 5 declares
// `Assertion<R, T>` (R = the matchers' return type), so the shipped
// augmentation no longer merges. The runtime matchers are registered by
// setupTests.ts with `@testing-library/jest-dom/matchers` plus `expect.extend`;
// this file only re-states the augmentation against the current signature.
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Assertion<R extends void | Promise<void> = void, T = unknown>
    extends TestingLibraryMatchers<any, R> {}
  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<any, any> {}
}
