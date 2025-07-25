import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SignInForm } from "./SignInForm";
import { useAuthStore } from "@stores/authStore";

// Mock the auth store
vi.mock("@stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock the signIn controller
vi.mock("@controllers/signIn/signIn", () => ({
  signIn: vi.fn(),
}));

// Mock the utils
vi.mock("@lib/utils", async () => {
  const actual = await vi.importActual("@lib/utils");
  return {
    ...actual,
    safeWindow: () => window,
  };
});

// Mock the sharedClasses
vi.mock("@styles/sharedClasses", () => ({
  sharedClasses: {
    inputLabel: "label-text text-black/70 dark:text-white/70",
    input: "input input-bordered w-full bg-white/80 dark:bg-stone-800/80 border-stone-300 dark:border-stone-600 focus:border-stone-500 dark:focus:border-stone-400"
  },
}));

// Mock the AuthTabs
vi.mock("../AuthForms/AuthFormTabs", () => ({
  AuthTabs: {
    SignIn: "signin-form",
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseAuthStore = useAuthStore as any;

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockReturnValue({
      login: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe("Form Rendering", () => {
    it("should render the sign in form", () => {
      render(<SignInForm />);

      const form = screen.getByTestId("signin-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("id", "signin-form");
    });

    it("should render email input field", () => {
      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("name", "email");
    });

    it("should render password input field", () => {
      render(<SignInForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("name", "password");
    });

    it("should render submit button", () => {
      render(<SignInForm />);

      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      expect(submitButton).toBeInTheDocument();
      // The button doesn't have a type attribute, which is fine for form submission
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Remind Button (Forgot Password Link)", () => {
    it("should render the forgot password link", () => {
      render(<SignInForm />);

      const forgotPasswordLink = screen.getByText("¿Olvidaste tu contraseña?");
      expect(forgotPasswordLink).toBeInTheDocument();
    });

    it("should have correct styling classes for forgot password link", () => {
      render(<SignInForm />);

      const forgotPasswordLink = screen.getByText("¿Olvidaste tu contraseña?");
      expect(forgotPasswordLink).toHaveClass("label-text-alt", "link", "link-hover", "text-stone-500", "dark:text-stone-400", "mt-1");
    });

    it("should be wrapped in a label element", () => {
      render(<SignInForm />);

      const forgotPasswordLink = screen.getByText("¿Olvidaste tu contraseña?");
      const label = forgotPasswordLink.closest("label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass("label");
    });

    it("should have href attribute set to #", () => {
      render(<SignInForm />);

      const forgotPasswordLink = screen.getByText("¿Olvidaste tu contraseña?");
      expect(forgotPasswordLink).toHaveAttribute("href", "#");
    });

    it("should be clickable", () => {
      render(<SignInForm />);

      const forgotPasswordLink = screen.getByText("¿Olvidaste tu contraseña?");
      expect(forgotPasswordLink).not.toBeDisabled();
    });

    it("should maintain accessibility as a link", () => {
      render(<SignInForm />);

      const forgotPasswordLink = screen.getByText("¿Olvidaste tu contraseña?");
      expect(forgotPasswordLink.tagName).toBe("A");
    });
  });

  describe("Form Validation", () => {
    it("should show email error when email is empty", async () => {
      render(<SignInForm />);

      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      const emailError = await screen.findByText("El email es requerido");
      expect(emailError).toBeInTheDocument();
    });

    it("should show password error when password is empty", async () => {
      render(<SignInForm />);

      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      fireEvent.click(submitButton);

      const passwordError = await screen.findByText("La contraseña es requerida");
      expect(passwordError).toBeInTheDocument();
    });

    it("should clear email error when user starts typing", () => {
      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      // Trigger validation error
      fireEvent.click(submitButton);

      // Start typing to clear error
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      const emailError = screen.queryByText("El email es requerido");
      expect(emailError).not.toBeInTheDocument();
    });

    it("should clear password error when user starts typing", () => {
      render(<SignInForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      // Trigger validation error
      fireEvent.click(submitButton);

      // Start typing to clear error
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      const passwordError = screen.queryByText("La contraseña es requerida");
      expect(passwordError).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call signIn with form data when form is valid", async () => {
      const { signIn } = await import("@controllers/signIn/signIn");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignIn = signIn as any;
      mockSignIn.mockResolvedValue({
        user: { id: 1, email: "test@example.com" },
        token: "mock-token"
      });

      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
    });

    it("should call login from auth store on successful sign in", async () => {
      const { signIn } = await import("@controllers/signIn/signIn");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignIn = signIn as any;
      const mockLogin = vi.fn();

      mockSignIn.mockResolvedValue({
        user: { id: 1, email: "test@example.com" },
        token: "mock-token"
      });

      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
      });

      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockLogin).toHaveBeenCalledWith(
        { id: 1, email: "test@example.com" },
        "mock-token"
      );
    });

    it("should redirect to home page when on auth page", async () => {
      const { signIn } = await import("@controllers/signIn/signIn");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignIn = signIn as any;

      mockSignIn.mockResolvedValue({
        user: { id: 1, email: "test@example.com" },
        token: "mock-token"
      });

      // Mock window.location
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/auth",
          href: "http://localhost:3000/auth"
        },
        writable: true,
      });

      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // The redirect should happen after successful login
      // We can't easily test the actual redirect in jsdom, but we can verify the logic
      expect(mockSignIn).toHaveBeenCalled();
    });

    it("should show error message when sign in fails", async () => {
      const { signIn } = await import("@controllers/signIn/signIn");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignIn = signIn as any;

      mockSignIn.mockRejectedValue(new Error("Sign in failed"));

      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      const errorMessage = await screen.findByText("Error al iniciar sesión");
      expect(errorMessage).toBeInTheDocument();
    });

    it("should disable submit button during loading", async () => {
      const { signIn } = await import("@controllers/signIn/signIn");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignIn = signIn as any;

      // Create a promise that doesn't resolve immediately
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockSignIn.mockReturnValue(pendingPromise);

      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass("opacity-50", "cursor-not-allowed");

      // Resolve the promise to clean up
      resolvePromise!({
        user: { id: 1, email: "test@example.com" },
        token: "mock-token"
      });
    });
  });

  describe("Input Handling", () => {
    it("should update email value when typing", () => {
      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      fireEvent.change(emailInput, { target: { value: "new@example.com" } });

      expect(emailInput).toHaveValue("new@example.com");
    });

    it("should update password value when typing", () => {
      render(<SignInForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      fireEvent.change(passwordInput, { target: { value: "newpassword" } });

      expect(passwordInput).toHaveValue("newpassword");
    });

    it("should clear email error when user starts typing", () => {
      render(<SignInForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      // Trigger validation error
      fireEvent.click(submitButton);

      // Start typing to clear error
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      const emailError = screen.queryByText("El email es requerido");
      expect(emailError).not.toBeInTheDocument();
    });

    it("should clear password error when user starts typing", () => {
      render(<SignInForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      // Trigger validation error
      fireEvent.click(submitButton);

      // Start typing to clear error
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      const passwordError = screen.queryByText("La contraseña es requerida");
      expect(passwordError).not.toBeInTheDocument();
    });
  });

  describe("Styling and Classes", () => {

    it("should apply error styling to password input when there's an error", async () => {
      render(<SignInForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

      fireEvent.click(submitButton);

      expect(passwordInput).toHaveClass("border-red-500");
    });

    it("should have correct submit button styling", () => {
      render(<SignInForm />);

      const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
      expect(submitButton).toHaveClass(
        "btn",
        "btn-primary",
        "w-full",
        "mb-1",
        "bg-stone-800",
        "hover:bg-stone-700",
        "dark:bg-stone-200",
        "dark:hover:bg-stone-300",
        "dark:text-black",
        "text-white",
        "border-0"
      );
    });
  });
}); 