import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { ShareButton } from "./ShareButton";

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaShare: () => <span data-testid="share-icon">📤</span>,
  FaLink: () => <span data-testid="link-icon">🔗</span>,
}));

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn(),
};

Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
});

// Mock window.location - this will be overridden by test setup
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:3000",
  },
  writable: true,
});

describe("ShareButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    cleanup();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  describe("Initial rendering", () => {
    it("should render the share button", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      expect(button).toBeInTheDocument();
    });

    it("should display 'Compartir' text initially", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      expect(button).toHaveTextContent("Compartir");
    });

    it("should render share icon initially", () => {
      render(<ShareButton />);

      const shareIcon = screen.getByTestId("share-icon");
      expect(shareIcon).toBeInTheDocument();
    });

    it("should not render link icon initially", () => {
      render(<ShareButton />);

      const linkIcon = screen.queryByTestId("link-icon");
      expect(linkIcon).not.toBeInTheDocument();
    });

    it("should have correct CSS classes", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      expect(button).toHaveClass(
        "btn",
        "btn-outline",
        "hover:btn-success",
        "btn-xs",
        "relative",
        "text-nowrap",
        "transition-all",
        "duration-300",
        "ease-in-out"
      );
    });
  });

  describe("Click functionality", () => {
    it("should call navigator.clipboard.writeText when clicked", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      expect(mockClipboard.writeText).toHaveBeenCalledWith("http://localhost:3000");
      expect(mockClipboard.writeText).toHaveBeenCalledTimes(1);
    });

    it("should change text to 'Link copiado' when clicked", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      expect(button).toHaveTextContent("Link copiado");
    });

    it("should change icon to link icon when clicked", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      const linkIcon = screen.getByTestId("link-icon");
      expect(linkIcon).toBeInTheDocument();
    });

    it("should not show share icon when clicked", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      const shareIcon = screen.queryByTestId("share-icon");
      expect(shareIcon).not.toBeInTheDocument();
    });
  });

  describe("State reset after timeout", () => {
    it("should reset to original state after 2 seconds", async () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      // Verify state changed
      expect(button).toHaveTextContent("Link copiado");
      expect(screen.getByTestId("link-icon")).toBeInTheDocument();

      // Fast-forward time by 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // State should reset immediately after timer
      expect(button).toHaveTextContent("Compartir");
      expect(screen.getByTestId("share-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("link-icon")).not.toBeInTheDocument();
    });

    it("should maintain clicked state for full 2 seconds", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      // Verify state changed
      expect(button).toHaveTextContent("Link copiado");

      // Fast-forward time by 1.9 seconds (just before reset)
      vi.advanceTimersByTime(1900);

      // State should still be "Link copiado"
      expect(button).toHaveTextContent("Link copiado");
    });

    it("should reset state exactly at 2 seconds", async () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      // Fast-forward time by exactly 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(button).toHaveTextContent("Compartir");
    });
  });

  describe("Multiple clicks behavior", () => {
    it("should handle multiple rapid clicks", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });

      // Click multiple times rapidly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should call clipboard.writeText for each click
      expect(mockClipboard.writeText).toHaveBeenCalledTimes(3);
    });

    it("should maintain 'Link copiado' state during rapid clicks", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });

      // Click multiple times rapidly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should still show "Link copiado"
      expect(button).toHaveTextContent("Link copiado");
    });

    it("should reset state after timeout even with multiple clicks", async () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });

      // Click multiple times
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Fast-forward time by 2 seconds
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(button).toHaveTextContent("Compartir");
    });
  });

  describe("Clipboard functionality", () => {
    it("should copy current window location href", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      expect(mockClipboard.writeText).toHaveBeenCalledWith("http://localhost:3000");
    });

    it("should handle empty href gracefully", () => {
      // Temporarily set href to empty
      Object.defineProperty(window, "location", {
        value: {
          href: "",
        },
        writable: true,
      });

      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      expect(mockClipboard.writeText).toHaveBeenCalledWith("");
    });

    it("should handle undefined href gracefully", () => {
      // Temporarily set href to undefined
      Object.defineProperty(window, "location", {
        value: {
          href: undefined,
        },
        writable: true,
      });

      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      expect(mockClipboard.writeText).toHaveBeenCalledWith("");
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });

      // Should be focusable
      button.focus();
      expect(button).toHaveFocus();

      // Should respond to click events (which is the standard for buttons)
      fireEvent.click(button);
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });

    it("should have proper button text for screen readers", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      expect(button).toHaveAccessibleName(/compartir/i);
    });
  });

  describe("Edge cases", () => {
    it("should handle clipboard API failure gracefully", () => {
      // Mock clipboard.writeText to throw an error
      mockClipboard.writeText.mockRejectedValueOnce(new Error("Clipboard API not available"));

      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });

      // Should not throw error when clicked
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();

      // Should still change state
      expect(button).toHaveTextContent("Link copiado");
    });

    it("should handle component unmount during timeout", () => {
      const { unmount } = render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      fireEvent.click(button);

      // Unmount component before timeout completes
      unmount();

      // Fast-forward time - should not cause errors
      expect(() => {
        vi.advanceTimersByTime(2000);
      }).not.toThrow();
    });

    it("should handle multiple timeouts correctly", async () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });

      // First click
      fireEvent.click(button);
      expect(button).toHaveTextContent("Link copiado");

      // Fast-forward past first timeout
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(button).toHaveTextContent("Compartir");

      // Second click
      fireEvent.click(button);
      expect(button).toHaveTextContent("Link copiado");

      // Fast-forward past second timeout
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(button).toHaveTextContent("Compartir");
    });
  });

  describe("Styling and Layout", () => {
    it("should have correct button styling", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      expect(button).toHaveClass(
        "btn",
        "btn-outline",
        "hover:btn-success",
        "btn-xs",
        "relative",
        "text-nowrap",
        "transition-all",
        "duration-300",
        "ease-in-out"
      );
    });

    it("should maintain styling during state changes", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      const initialClasses = button.className;

      act(() => {
        fireEvent.click(button);
      });
      expect(button.className).toBe(initialClasses);

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(button.className).toBe(initialClasses);
    });

    it("should have proper text wrapping", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      expect(button).toHaveClass("text-nowrap");
    });

    it("should have smooth transitions", () => {
      render(<ShareButton />);

      const button = screen.getByRole("button", { name: /compartir/i });
      expect(button).toHaveClass("transition-all", "duration-300", "ease-in-out");
    });
  });


}); 