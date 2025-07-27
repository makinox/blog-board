import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { VerifyEmailForm } from "./VerifyEmailForm";
import * as verifyEmailController from "@controllers/verifyEmail/verifyEmail";
import * as utils from "@lib/utils";

vi.mock("@controllers/verifyEmail/verifyEmail");
vi.mock("@lib/utils");

const mockVerifyEmail = vi.mocked(verifyEmailController.verifyEmail);
const mockSafeWindow = vi.mocked(utils.safeWindow);

describe("VerifyEmailForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSafeWindow.mockReturnValue({
      location: {
        search: "?token=test-token",
        href: "http://localhost:4321/verify-email?token=test-token"
      }
    } as Window);
  });

  it("should show loading state initially", () => {
    render(<VerifyEmailForm />);

    expect(screen.getByText("Verificando tu email...")).toBeInTheDocument();
  });

  it("should show success message when verification succeeds", async () => {
    mockVerifyEmail.mockResolvedValue({
      success: true,
      message: "Email verificado exitosamente",
    });

    render(<VerifyEmailForm />);

    await waitFor(() => {
      expect(screen.getByText("¡Email verificado exitosamente!")).toBeInTheDocument();
    });
  });

  it("should show error message when verification fails", async () => {
    mockVerifyEmail.mockResolvedValue({
      success: false,
      message: "Token inválido o expirado",
    });

    render(<VerifyEmailForm />);

    await waitFor(() => {
      expect(screen.getByText("Error al verificar el email")).toBeInTheDocument();
    });

    expect(screen.getByText("Token inválido o expirado")).toBeInTheDocument();
  });

  it("should show error message when API call fails", async () => {
    mockVerifyEmail.mockRejectedValue(new Error("Network error"));

    render(<VerifyEmailForm />);

    await waitFor(() => {
      expect(screen.getByText("Error al verificar el email")).toBeInTheDocument();
    });
  });

  it("should not call verifyEmail when no token is present", async () => {
    mockSafeWindow.mockReturnValue({
      location: {
        search: "",
        href: "http://localhost:4321/verify-email"
      }
    } as Window);

    render(<VerifyEmailForm />);

    expect(screen.getByText("Verificando tu email...")).toBeInTheDocument();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockVerifyEmail).not.toHaveBeenCalled();
  });

  it("should handle null window gracefully", async () => {
    mockSafeWindow.mockReturnValue(null);

    render(<VerifyEmailForm />);

    expect(screen.getByText("Verificando tu email...")).toBeInTheDocument();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockVerifyEmail).not.toHaveBeenCalled();
  });
}); 