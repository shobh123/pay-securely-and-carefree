import '@testing-library/jest-dom';

// Polyfill matchMedia for next-themes usage in jsdom
if (typeof window !== 'undefined' && !window.matchMedia) {
  // @ts-expect-error - define on window
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Optional: reduce noise from console errors during tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const message = String(args[0] ?? '');
  if (
    message.includes('Warning: ReactDOM.render is no longer supported') ||
    message.includes('An update to BrowserRouter')
  ) {
    return;
  }
  // @ts-expect-error - preserve signature
  originalError(...args);
};