import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeaderSign } from "./HeaderSign";
import { useAuthStore } from "@stores/authStore";

// Mock the auth store
vi.mock("@stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseAuthStore = useAuthStore as any;

describe("HeaderSign", () => {
  const mockUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    visitor_id: null,
    email_verified: true,
    created_at: "2023-01-01T00:00:00Z",
  };

  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("When user is not authenticated", () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: mockLogout,
      });
    });

    it("should render sign in button", () => {
      render(<HeaderSign />);

      const signInButton = screen.getByRole("link", { name: "Iniciar Sesión" });
      expect(signInButton).toBeInTheDocument();
    });

    it("should have correct href for sign in button", () => {
      render(<HeaderSign />);

      const signInButton = screen.getByRole("link", { name: "Iniciar Sesión" });
      expect(signInButton).toHaveAttribute("href", "/auth");
    });

    it("should have correct CSS classes for sign in button", () => {
      render(<HeaderSign />);

      const signInButton = screen.getByRole("link", { name: "Iniciar Sesión" });
      expect(signInButton).toHaveClass(
        "btn",
        "btn-outline",
        "btn-xs",
        "hover:btn-info",
      );
    });

    it("should not render avatar or dropdown when not authenticated", () => {
      render(<HeaderSign />);

      expect(
        screen.queryByRole("button", { name: /avatar/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Hola John")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Cerrar sesión" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("When user is authenticated", () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        logout: mockLogout,
      });
    });

    it("should render avatar button", () => {
      render(<HeaderSign />);

      const avatarButton = screen.getByRole("button", { name: "J" });
      expect(avatarButton).toBeInTheDocument();
      expect(avatarButton).toHaveClass(
        "avatar",
        "avatar-placeholder",
        "cursor-pointer",
      );
    });

    it("should render user's first initial in avatar", () => {
      render(<HeaderSign />);

      const avatarInitial = screen.getByText("J");
      expect(avatarInitial).toBeInTheDocument();
    });

    it("should handle user with empty name gracefully", () => {
      const userWithEmptyName = { ...mockUser, name: "" };
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: userWithEmptyName,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      const avatarButton = screen.getByRole("button", { name: "" });
      expect(avatarButton).toBeInTheDocument();
    });

    it("should handle user with single character name", () => {
      const userWithSingleChar = { ...mockUser, name: "A" };
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: userWithSingleChar,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      const avatarInitial = screen.getByText("A");
      expect(avatarInitial).toBeInTheDocument();
    });

    it("should render greeting with user's name", () => {
      render(<HeaderSign />);

      const greeting = screen.getByText("Hola John Doe");
      expect(greeting).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper link role when not authenticated", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle null user gracefully", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: null,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      // Should still render the avatar button but with no initial
      const avatarButton = screen.getByRole("button", { name: "" });
      expect(avatarButton).toBeInTheDocument();

      // Should show "Hola " without a name
      const greeting = screen.getByText("Hola");
      expect(greeting).toBeInTheDocument();
    });

    it("should handle undefined user gracefully", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: undefined as any,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      // Should still render the avatar button
      const avatarButton = screen.getByRole("button", { name: "" });
      expect(avatarButton).toBeInTheDocument();
    });

    it("should handle user with special characters in name", () => {
      const userWithSpecialChars = { ...mockUser, name: "José María" };
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: userWithSpecialChars,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      const avatarInitial = screen.getByText("J");
      expect(avatarInitial).toBeInTheDocument();
    });

    it("should handle user with numbers in name", () => {
      const userWithNumbers = { ...mockUser, name: "John123" };
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: userWithNumbers,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      const avatarInitial = screen.getByText("J");
      expect(avatarInitial).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("should have correct avatar styling when authenticated", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: mockUser,
        logout: mockLogout,
      });

      render(<HeaderSign />);

      const avatarContainer = screen.getByText("J").closest("div");
      expect(avatarContainer).toHaveClass(
        "bg-transparent",
        "border",
        "border-stone-400",
        "w-8",
        "rounded-full",
        "hover:border-stone-500",
      );
    });
  });
});
