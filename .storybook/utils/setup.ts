// Jest setup for Lit and custom elements
// Polyfill for attachShadow if needed in jsdom
if (typeof window !== 'undefined' && !window.HTMLElement.prototype.attachShadow) {
  // @ts-ignore
  window.HTMLElement.prototype.attachShadow = function () {
    return { adoptedStyleSheets: [] } as unknown as ShadowRoot;
  };
}

// Mock IntersectionObserver etc if needed
if (typeof window !== 'undefined' && !(window as any).customElements) {
  (window as any).customElements = {
    define: () => {},
    get: () => undefined,
  };
}
