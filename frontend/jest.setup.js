// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Suppress act() warnings in tests
// This is a known issue with React 19 and testing-library
// The warnings are informational and don't affect test correctness
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("not wrapped in act(...)")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useParams() {
    return {};
  },
}));

