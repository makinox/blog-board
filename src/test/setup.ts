import { vi } from "vitest";
import "@testing-library/jest-dom";

Object.defineProperty(window, "location", {
  value: {
    hash: "",
    href: "http://localhost:3000",
  },
  writable: true,
});

// Mock HTMLDialogElement methods for jsdom
Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(HTMLDialogElement.prototype, "close", {
  value: vi.fn(),
  writable: true,
});

vi.mock("@lib/utils", async () => {
  const actual = await vi.importActual("@lib/utils");
  return {
    ...actual,
    safeWindow: () => window,
  };
}); 