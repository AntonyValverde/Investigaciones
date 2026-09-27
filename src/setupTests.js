// src/setupTests.js — APIs del navegador que jsdom no implementa
import "@testing-library/jest-dom/vitest";

window.matchMedia ||= (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
window.IntersectionObserver ||= IO;
window.scrollTo = () => {};
HTMLCanvasElement.prototype.getContext = () => null;
