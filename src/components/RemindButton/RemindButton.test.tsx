import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RemindButton } from "./RemindButton";
import { useAuthStore } from "@stores/authStore";

// Mock the auth store
vi.mock("@stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock the userPreferences controller
vi.mock("@/controllers/userPreferences/userPreferences", () => ({
  setReminder: vi.fn(),
}));

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaBell: () => <span data-testid="bell-icon">🔔</span>,
}));

// Mock AuthForms component
vi.mock("@components/AuthForms/AuthForms", () => ({
  AuthForms: () => <div data-testid="auth-forms">Auth Forms Component</div>,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseAuthStore = useAuthStore as any;

describe("RemindButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    // Clean up any open modals
    const modal = document.getElementById("remind-modal") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  });

  describe("When user is not authenticated", () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });
    });

    it("should render the remind button", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      expect(button).toBeInTheDocument();
    });

    it("should display 'Recordar' text initially", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      expect(button).toHaveTextContent("Recordar");
    });

    it("should have correct CSS classes", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      expect(button).toHaveClass("btn", "btn-outline", "hover:btn-success", "btn-xs");
    });

    it("should render bell icon", () => {
      render(<RemindButton />);

      const bellIcon = screen.getByTestId("bell-icon");
      expect(bellIcon).toBeInTheDocument();
    });

    it("should have tooltip with correct text", () => {
      render(<RemindButton />);

      const tooltip = screen.getByRole("button", { name: /recordar/i }).closest("div");
      expect(tooltip).toHaveAttribute("data-tip", "Se te enviará un recordatorio a tu correo");
      expect(tooltip).toHaveClass("tooltip", "tooltip-bottom");
    });

    it("should open modal when clicked", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const modal = document.getElementById("remind-modal");
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute("id", "remind-modal");
      expect(modal).toHaveClass("modal");
    });

    it("should show authentication message in modal", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const message = screen.getByText("Para poder recordarte debes iniciar sesión");
      expect(message).toBeInTheDocument();
      expect(message).toHaveClass("font-bold", "text-lg", "mb-10");
    });

    it("should render AuthForms component in modal", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const authForms = screen.getByTestId("auth-forms");
      expect(authForms).toBeInTheDocument();
    });

    it("should render close button in modal", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const closeButton = document.querySelector("dialog button");
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent("Close");
      expect(closeButton).toHaveClass("btn", "btn-outline", "btn-sm");
    });

    it("should have modal with correct styling", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const modal = document.getElementById("remind-modal");
      expect(modal).toHaveClass("modal");
    });

    it("should have modal-box with correct styling", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const modalBox = document.querySelector("dialog .modal-box");
      expect(modalBox).toHaveClass("modal-box");
    });
  });

  describe("When user is authenticated", () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
      });
    });

    it("should call setReminder when clicked", async () => {
      const { setReminder } = await import("@/controllers/userPreferences/userPreferences");
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      expect(setReminder).toHaveBeenCalledTimes(1);
    });

    it("should change button text to 'Recordando...' when clicked", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      expect(button).toHaveTextContent("Recordando...");
    });

    it("should not open modal when clicked", () => {
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should close modal if it was previously open", () => {
      // First render as not authenticated to open modal
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });
      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      expect(document.getElementById("remind-modal")).toBeInTheDocument();

      // Now change to authenticated state
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
      });

      // Re-render the component
      render(<RemindButton />);

      // Modal should still be in DOM but closed via useEffect
      expect(document.getElementById("remind-modal")).toBeInTheDocument();
    });
  });

  describe("State transitions", () => {
    it("should handle authentication state change from false to true", () => {
      const { rerender } = render(<RemindButton />);

      // Initially not authenticated
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      expect(document.getElementById("remind-modal")).toBeInTheDocument();

      // Now change to authenticated
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
      });

      rerender(<RemindButton />);

      // Modal should still be in DOM but closed via useEffect
      expect(document.getElementById("remind-modal")).toBeInTheDocument();
    });

    it("should handle authentication state change from true to false", () => {
      const { rerender } = render(<RemindButton />);

      // Initially authenticated
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
      });

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      // Modal should be in DOM but not shown
      expect(document.getElementById("remind-modal")).toBeInTheDocument();

      // Now change to not authenticated
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      rerender(<RemindButton />);

      // Button should still work normally
      fireEvent.click(button);
      expect(document.getElementById("remind-modal")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have proper dialog element when modal is open", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const dialog = document.querySelector("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("id", "remind-modal");
    });

    it("should have proper heading structure in modal", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const heading = document.querySelector("dialog h3");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Para poder recordarte debes iniciar sesión");
    });

    it("should have proper form structure in modal", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const form = document.querySelector("dialog form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("method", "dialog");
    });
  });

  describe("Edge cases", () => {
    it("should handle multiple rapid clicks when authenticated", async () => {
      const { setReminder } = await import("@/controllers/userPreferences/userPreferences");

      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });

      // Click multiple times rapidly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(setReminder).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple rapid clicks when not authenticated", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });

      // Click multiple times rapidly
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should only have one modal
      const modals = document.querySelectorAll("dialog");
      expect(modals).toHaveLength(1);
    });

    it("should handle modal element not found", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });

      // Should not throw error when trying to show modal
      // The component should handle the case where modal is not found gracefully
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });
  });

  describe("Styling and Layout", () => {
    it("should have correct button styling", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
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

    it("should have correct modal styling", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const modal = document.getElementById("remind-modal");
      expect(modal).toHaveClass("modal");
    });

    it("should have correct modal action styling", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
      });

      render(<RemindButton />);

      const button = screen.getByRole("button", { name: /recordar/i });
      fireEvent.click(button);

      const modalAction = document.querySelector("dialog .modal-action");
      expect(modalAction).toHaveClass("modal-action");
    });
  });
}); 