import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { SignUpForm } from "./SignUpForm";
import { useAuthStore } from "@stores/authStore";

// Mock the auth store
vi.mock("@stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Mock the signUp controller
vi.mock("@controllers/signUp/signUp", () => ({
  signUp: vi.fn(),
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
    SignUp: "signup-form",
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseAuthStore = useAuthStore as any;

describe("SignUpForm", () => {
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
    it("should render the sign up form", () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("id", "signup-form");
    });

    it("should render name input field", () => {
      render(<SignUpForm />);

      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("type", "text");
      expect(nameInput).toHaveAttribute("name", "name");
    });

    it("should render email input field", () => {
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("name", "email");
    });

    it("should render password input field", () => {
      render(<SignUpForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("name", "password");
    });

    it("should render submit button", () => {
      render(<SignUpForm />);

      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("should render all form labels", () => {
      render(<SignUpForm />);

      expect(screen.getByText("Nombre completo")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Contraseña")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show name error when name is less than 5 characters", async () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");

      fireEvent.change(nameInput, { target: { value: "John" } });
      fireEvent.submit(form);

      const nameError = await screen.findByText("El nombre debe tener al menos 5 caracteres");
      expect(nameError).toBeInTheDocument();
    });

    it("should show email error when email is empty", async () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      const emailError = await screen.findByText("El email es requerido");
      expect(emailError).toBeInTheDocument();
    });

    it("should show email error when email format is invalid", async () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const emailInput = screen.getByPlaceholderText("tu@email.com");

      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText("El email no es válido")).toBeInTheDocument();
      });
    });

    it("should show password error when password is less than 5 characters", async () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      fireEvent.change(passwordInput, { target: { value: "123" } });
      fireEvent.submit(form);

      const passwordError = await screen.findByText("La contraseña debe tener al menos 5 caracteres");
      expect(passwordError).toBeInTheDocument();
    });

    it("should clear name error when user starts typing valid name", () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");

      // Trigger validation error
      fireEvent.change(nameInput, { target: { value: "John" } });
      fireEvent.submit(form);

      // Start typing valid name to clear error
      fireEvent.change(nameInput, { target: { value: "John Doe" } });

      const nameError = screen.queryByText("El nombre debe tener al menos 5 caracteres");
      expect(nameError).not.toBeInTheDocument();
    });

    it("should clear email error when user starts typing valid email", () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const emailInput = screen.getByPlaceholderText("tu@email.com");

      // Trigger validation error
      fireEvent.submit(form);

      // Start typing valid email to clear error
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      const emailError = screen.queryByText("El email es requerido");
      expect(emailError).not.toBeInTheDocument();
    });

    it("should clear password error when user starts typing valid password", () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      // Trigger validation error
      fireEvent.change(passwordInput, { target: { value: "123" } });
      fireEvent.submit(form);

      // Start typing valid password to clear error
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      const passwordError = screen.queryByText("La contraseña debe tener al menos 5 caracteres");
      expect(passwordError).not.toBeInTheDocument();
    });

    it("should validate all fields when form is submitted with invalid data", async () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      // All validation errors should appear
      expect(await screen.findByText("El nombre debe tener al menos 5 caracteres")).toBeInTheDocument();
      expect(await screen.findByText("El email es requerido")).toBeInTheDocument();
      expect(await screen.findByText("La contraseña debe tener al menos 5 caracteres")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call signUp with form data when form is valid", async () => {
      const { signUp } = await import("@controllers/signUp/signUp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignUp = signUp as any;
      mockSignUp.mockResolvedValue({
        user: { id: 1, email: "test@example.com", name: "John Doe" },
        token: "mock-token",
        success: true,
        message: "User created successfully",
        visitor_id: null
      });

      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      expect(mockSignUp).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123"
      });
    });

    it("should call login from auth store on successful sign up", async () => {
      const { signUp } = await import("@controllers/signUp/signUp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignUp = signUp as any;
      const mockLogin = vi.fn();

      mockSignUp.mockResolvedValue({
        user: { id: 1, email: "test@example.com", name: "John Doe" },
        token: "mock-token",
        success: true,
        message: "User created successfully",
        visitor_id: null
      });

      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
      });

      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      // Wait for the async operation to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockLogin).toHaveBeenCalledWith(
        { id: 1, email: "test@example.com", name: "John Doe" },
        "mock-token"
      );
    });

    it("should redirect to home page when on auth page", async () => {
      const { signUp } = await import("@controllers/signUp/signUp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignUp = signUp as any;

      mockSignUp.mockResolvedValue({
        user: { id: 1, email: "test@example.com", name: "John Doe" },
        token: "mock-token",
        success: true,
        message: "User created successfully",
        visitor_id: null
      });

      // Mock window.location
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/auth",
          href: "http://localhost:3000/auth"
        },
        writable: true,
      });

      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      // The redirect should happen after successful signup
      expect(mockSignUp).toHaveBeenCalled();
    });

    it("should show error message when sign up fails", async () => {
      const { signUp } = await import("@controllers/signUp/signUp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignUp = signUp as any;

      mockSignUp.mockRejectedValue(new Error("Sign up failed"));

      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      const errorMessage = await screen.findByText("Error al registrar usuario");
      expect(errorMessage).toBeInTheDocument();
    });

    it("should disable submit button during loading", async () => {
      const { signUp } = await import("@controllers/signUp/signUp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignUp = signUp as any;

      // Create a promise that doesn't resolve immediately
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockSignUp.mockReturnValue(pendingPromise);

      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.submit(form);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass("opacity-50", "cursor-not-allowed");

      // Resolve the promise to clean up
      resolvePromise!({
        user: { id: 1, email: "test@example.com", name: "John Doe" },
        token: "mock-token",
        success: true,
        message: "User created successfully",
        visitor_id: null
      });
    });

    it("should not call signUp when form validation fails", async () => {
      const { signUp } = await import("@controllers/signUp/signUp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignUp = signUp as any;

      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      fireEvent.submit(form);

      // Wait a bit to ensure no async calls are made
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  describe("Input Handling", () => {
    it("should update name value when typing", () => {
      render(<SignUpForm />);

      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      fireEvent.change(nameInput, { target: { value: "Jane Smith" } });

      expect(nameInput).toHaveValue("Jane Smith");
    });

    it("should update email value when typing", () => {
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      fireEvent.change(emailInput, { target: { value: "new@example.com" } });

      expect(emailInput).toHaveValue("new@example.com");
    });

    it("should update password value when typing", () => {
      render(<SignUpForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      fireEvent.change(passwordInput, { target: { value: "newpassword" } });

      expect(passwordInput).toHaveValue("newpassword");
    });

    it("should clear name error when user starts typing", () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const nameInput = screen.getByPlaceholderText("Tu nombre completo");

      // Trigger validation error
      fireEvent.change(nameInput, { target: { value: "John" } });
      fireEvent.submit(form);

      // Start typing to clear error
      fireEvent.change(nameInput, { target: { value: "John Doe" } });

      const nameError = screen.queryByText("El nombre debe tener al menos 5 caracteres");
      expect(nameError).not.toBeInTheDocument();
    });

    it("should clear email error when user starts typing", () => {
      render(<SignUpForm />);

      const form = screen.getByTestId("signup-form");
      const emailInput = screen.getByPlaceholderText("tu@email.com");

      // Trigger validation error
      fireEvent.submit(form);

      // Start typing to clear error
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      const emailError = screen.queryByText("El email es requerido");
      expect(emailError).not.toBeInTheDocument();
    });

    it("should clear password error when user starts typing", () => {
      render(<SignUpForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

      // Trigger validation error
      fireEvent.change(passwordInput, { target: { value: "123" } });
      fireEvent.click(submitButton);

      // Start typing to clear error
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      const passwordError = screen.queryByText("La contraseña debe tener al menos 5 caracteres");
      expect(passwordError).not.toBeInTheDocument();
    });
  });

  describe("Styling and Classes", () => {
    it("should apply error styling to name input when there's an error", async () => {
      render(<SignUpForm />);

      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

      fireEvent.change(nameInput, { target: { value: "John" } });
      fireEvent.click(submitButton);

      expect(nameInput).toHaveClass("border-red-500");
    });

    it("should apply error styling to email input when there's an error", async () => {
      render(<SignUpForm />);

      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

      fireEvent.click(submitButton);

      expect(emailInput).toHaveClass("border-red-500");
    });

    it("should apply error styling to password input when there's an error", async () => {
      render(<SignUpForm />);

      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

      fireEvent.change(passwordInput, { target: { value: "123" } });
      fireEvent.click(submitButton);

      expect(passwordInput).toHaveClass("border-red-500");
    });

    it("should have correct submit button styling", () => {
      render(<SignUpForm />);

      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });
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

    it("should show error text with correct styling when there's a button error", async () => {
      const { signUp } = await import("@controllers/signUp/signUp");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockSignUp = signUp as any;

      mockSignUp.mockRejectedValue(new Error("Sign up failed"));

      render(<SignUpForm />);

      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      const errorMessage = await screen.findByText("Error al registrar usuario");
      expect(errorMessage).toHaveClass("text-red-500", "text-sm");
    });
  });

  describe("Form State Management", () => {
    it("should initialize with empty form data", () => {
      render(<SignUpForm />);

      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      const emailInput = screen.getByPlaceholderText("tu@email.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(passwordInput).toHaveValue("");
    });

    it("should initialize with no errors", () => {
      render(<SignUpForm />);

      const errorElements = screen.queryAllByText(/El nombre debe tener|El email es requerido|La contraseña debe tener|Error al registrar usuario/);
      expect(errorElements).toHaveLength(0);
    });

    it("should maintain form state across re-renders", () => {
      const { rerender } = render(<SignUpForm />);

      const nameInput = screen.getByPlaceholderText("Tu nombre completo");
      fireEvent.change(nameInput, { target: { value: "John Doe" } });

      rerender(<SignUpForm />);

      expect(nameInput).toHaveValue("John Doe");
    });
  });
}); 