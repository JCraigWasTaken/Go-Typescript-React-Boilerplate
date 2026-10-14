// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent('react');
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';
import { BroadcastChannel } from 'worker_threads';

// msw 2 requires web APIs that the jsdom test environment does not
// provide (msw 1.x-to-2.x migration guide).
Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
  ReadableStream,
  TransformStream,
  WritableStream,
  BroadcastChannel,
});

// testEnvironment.js (wired via `react-scripts test --env`) stashes the Node
// runtime's native fetch APIs on __nodeWebApis. react-app-polyfill's
// whatwg-fetch (XHR-based) overwrote them after the environment constructor
// ran, so restore them here: msw 2 reads mocked response bodies through
// these globals, and the XHR-based polyfill returns empty bodies.
const nodeWebApis = (globalThis as { __nodeWebApis?: Record<string, unknown> })
  .__nodeWebApis;
if (nodeWebApis) {
  Object.assign(globalThis, nodeWebApis);
}

console.error = jest.fn();
console.warn = jest.fn();
