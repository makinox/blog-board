import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResetPasswordForm } from "./ResetPasswordForm";

vi.mock("@controllers/resetPassword/resetPassword", () => ({
  resetPassword: vi.fn()
}));

vi.mock("@lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" ")
}));

const mockLocation = {
  search: "?token=test-token"
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true
});

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true
    });
  });

  it("renders the form correctly with valid token", async () => {
    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Change Password" })).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
    });
  });

  it("shows error when there is no token", async () => {
    Object.defineProperty(window, "location", {
      value: { search: "" },
      writable: true
    });

    render(<ResetPasswordForm />);

    await waitFor(() => {
      expect(screen.getByText("Invalid Token")).toBeInTheDocument();
      expect(screen.getByText("The link to reset your password is invalid or has expired.")).toBeInTheDocument();
    });
  });

  it("validates that password is required", async () => {
    render(<ResetPasswordForm />);

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: "Change Password" });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("New password is required")).toBeInTheDocument();
    });
  });

  it("validates that password has at least 6 characters", async () => {
    render(<ResetPasswordForm />);

    await waitFor(() => {
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      fireEvent.change(passwordInputs[0], { target: { value: "123" } });

      const submitButton = screen.getByRole("button", { name: "Change Password" });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    });
  });

  it("validates that passwords match", async () => {
    render(<ResetPasswordForm />);

    await waitFor(() => {
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      fireEvent.change(passwordInputs[0], { target: { value: "123456" } });
      fireEvent.change(passwordInputs[1], { target: { value: "654321" } });

      const submitButton = screen.getByRole("button", { name: "Change Password" });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("shows link to go back to login", async () => {
    render(<ResetPasswordForm />);

    await waitFor(() => {
      const backLink = screen.getByText("← Back to login");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/auth");
    });
  });
}); 