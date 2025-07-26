import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthForms } from "./AuthForms";
import { AuthTabs } from "./AuthFormTabs";

// Mock the child components
vi.mock("@components/SignInForm/SignInForm", () => ({
  SignInForm: () => <div data-testid="signin-form">Sign In Form</div>,
}));

vi.mock("@components/SignUpForm/SignUpForm", () => ({
  SignUpForm: () => <div data-testid="signup-form">Sign Up Form</div>,
}));

describe("AuthForms", () => {
  beforeEach(() => {
    // Reset window.location.hash before each test
    Object.defineProperty(window, "location", {
      value: {
        hash: "",
        href: "http://localhost:3000",
      },
      writable: true,
    });
  });

  describe("Initial Rendering", () => {
    it("should render both tabs", () => {
      render(<AuthForms />);

      expect(screen.getByRole("tab", { name: "Iniciar Sesión" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Registrarse" })).toBeInTheDocument();
    });

    it("should render SignIn tab as active by default when no hash is present", () => {
      render(<AuthForms />);

      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      const signUpTab = screen.getByRole("tab", { name: "Registrarse" });

      expect(signInTab).toHaveClass("tab-active");
      expect(signUpTab).not.toHaveClass("tab-active");
    });

    it("should render SignIn form by default when no hash is present", () => {
      render(<AuthForms />);

      expect(screen.getByTestId("signin-form")).toBeInTheDocument();
      expect(screen.queryByTestId("signup-form")).not.toBeInTheDocument();
    });

    it("should render SignIn tab as active when hash is #SignIn-tab", () => {
      Object.defineProperty(window, "location", {
        value: {
          hash: "#SignIn-tab",
          href: "http://localhost:3000",
        },
        writable: true,
      });

      render(<AuthForms />);

      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      expect(signInTab).toHaveClass("tab-active");
    });

    it("should render SignUp tab as active when hash is #SignUp-tab", () => {
      Object.defineProperty(window, "location", {
        value: {
          hash: "#SignUp-tab",
          href: "http://localhost:3000",
        },
        writable: true,
      });

      render(<AuthForms />);

      const signUpTab = screen.getByRole("tab", { name: "Registrarse" });
      expect(signUpTab).toHaveClass("tab-active");
    });

    it("should render SignUp form when hash is #SignUp-tab", () => {
      Object.defineProperty(window, "location", {
        value: {
          hash: "#SignUp-tab",
          href: "http://localhost:3000",
        },
        writable: true,
      });

      render(<AuthForms />);

      expect(screen.getByTestId("signup-form")).toBeInTheDocument();
      expect(screen.queryByTestId("signin-form")).not.toBeInTheDocument();
    });
  });

  describe("Tab Switching", () => {
    it("should switch to SignUp tab when SignUp tab is clicked", () => {
      render(<AuthForms />);

      const signUpTab = screen.getByRole("tab", { name: "Registrarse" });
      fireEvent.click(signUpTab);

      expect(signUpTab).toHaveClass("tab-active");
      expect(screen.getByTestId("signup-form")).toBeInTheDocument();
      expect(screen.queryByTestId("signin-form")).not.toBeInTheDocument();
    });

    it("should switch to SignIn tab when SignIn tab is clicked", () => {
      // Start with SignUp tab active
      Object.defineProperty(window, "location", {
        value: {
          hash: "#SignUp-tab",
          href: "http://localhost:3000",
        },
        writable: true,
      });

      render(<AuthForms />);

      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      fireEvent.click(signInTab);

      expect(signInTab).toHaveClass("tab-active");
      expect(screen.getByTestId("signin-form")).toBeInTheDocument();
      expect(screen.queryByTestId("signup-form")).not.toBeInTheDocument();
    });

    it("should update window.location.hash when tab is clicked", () => {
      const mockLocation = {
        hash: "",
        href: "http://localhost:3000",
        pathname: "/auth",
      };

      Object.defineProperty(window, "location", {
        value: mockLocation,
        writable: true,
      });

      render(<AuthForms />);

      const signUpTab = screen.getByRole("tab", { name: "Registrarse" });
      fireEvent.click(signUpTab);

      expect(mockLocation.hash).toBe("SignUp-tab");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA roles", () => {
      render(<AuthForms />);

      const tablist = screen.getByRole("tablist");
      const tabs = screen.getAllByRole("tab");

      expect(tablist).toBeInTheDocument();
      expect(tabs).toHaveLength(2);
    });

    it("should have proper tab IDs", () => {
      render(<AuthForms />);

      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      const signUpTab = screen.getByRole("tab", { name: "Registrarse" });

      expect(signInTab).toHaveAttribute("id", AuthTabs.SignIn);
      expect(signUpTab).toHaveAttribute("id", AuthTabs.SignUp);
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS classes to tabs", () => {
      render(<AuthForms />);

      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      const signUpTab = screen.getByRole("tab", { name: "Registrarse" });

      expect(signInTab).toHaveClass("tab", "w-1/2", "tab-active");
      expect(signUpTab).toHaveClass("tab", "w-1/2");
      expect(signUpTab).not.toHaveClass("tab-active");
    });

    it("should have proper container styling", () => {
      render(<AuthForms />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass("tabs", "tabs-box", "bg-stone-200/50", "dark:bg-stone-800/50", "mb-6");
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid hash values gracefully", () => {
      Object.defineProperty(window, "location", {
        value: {
          hash: "#invalid-tab",
          href: "http://localhost:3000",
        },
        writable: true,
      });

      render(<AuthForms />);

      // When hash is invalid, activeTab becomes 'invalid-tab' which doesn't match any AuthTabs
      // So no tab will be active and no form will be rendered
      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      const signUpTab = screen.getByRole("tab", { name: "Registrarse" });

      expect(signInTab).not.toHaveClass("tab-active");
      expect(signUpTab).not.toHaveClass("tab-active");
      expect(screen.queryByTestId("signin-form")).not.toBeInTheDocument();
      expect(screen.queryByTestId("signup-form")).not.toBeInTheDocument();
    });

    it("should handle empty hash gracefully", () => {
      Object.defineProperty(window, "location", {
        value: {
          hash: "",
          href: "http://localhost:3000",
        },
        writable: true,
      });

      render(<AuthForms />);

      // Should default to SignIn tab
      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      expect(signInTab).toHaveClass("tab-active");
      expect(screen.getByTestId("signin-form")).toBeInTheDocument();
    });

    it("should handle hash with only # symbol", () => {
      Object.defineProperty(window, "location", {
        value: {
          hash: "#",
          href: "http://localhost:3000",
        },
        writable: true,
      });

      render(<AuthForms />);

      // Should default to SignIn tab
      const signInTab = screen.getByRole("tab", { name: "Iniciar Sesión" });
      expect(signInTab).toHaveClass("tab-active");
      expect(screen.getByTestId("signin-form")).toBeInTheDocument();
    });
  });
}); 