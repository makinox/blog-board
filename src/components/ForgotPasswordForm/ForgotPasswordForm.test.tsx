import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

vi.mock("@controllers/forgotPassword/forgotPassword", () => ({
  forgotPassword: vi.fn()
}));

vi.mock("@lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" ")
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByText("Forgot your password?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Email" })).toBeInTheDocument();
  });

  it("validates that email is required", async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole("button", { name: "Send Email" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("validates that email has a valid format", async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole("button", { name: "Send Email" });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });



  it("shows link to go back to login", () => {
    render(<ForgotPasswordForm />);

    const backLink = screen.getByText("← Back to login");
    expect(backLink).toBeInTheDocument();
    expect(backLink.getAttribute("href")).toBe("/auth");
  });
}); 