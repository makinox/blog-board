import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { UserLikesList } from "./UserLikesList";
import { getUserLikes } from "@controllers/blogLikes/blogLikes";
import { useAuthStore } from "@stores/authStore";


vi.mock("@controllers/blogLikes/blogLikes");
vi.mock("@stores/authStore");
vi.mock("@components/ArrowCard/ArrowCard", () => ({
  ArrowCard: ({ title, slug }: { title: string; slug: string }) => (
    <a href={`/blog/${slug}`} data-testid={`arrow-card-${slug}`}>
      {title}
    </a>
  )
}));

const mockGetUserLikes = vi.mocked(getUserLikes);
const mockUseAuthStore = vi.mocked(useAuthStore);

describe("UserLikesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2024-01-01" },
      token: "test-token",
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      clearAuth: vi.fn()
    });

    mockGetUserLikes.mockImplementation(() => new Promise(() => { })); // Never resolves

    render(<UserLikesList />);

    expect(screen.getByText("Cargando tus likes...")).toBeInTheDocument();
  });

  it("should show error when user is not authenticated", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      clearAuth: vi.fn()
    });

    render(<UserLikesList />);

    await waitFor(() => {
      expect(screen.getByText("Debes iniciar sesión para ver tus likes")).toBeInTheDocument();
    });
  });

  it("should show empty state when user has no likes", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2024-01-01" },
      token: "test-token",
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      clearAuth: vi.fn()
    });

    mockGetUserLikes.mockResolvedValue({
      success: true,
      message: "Likes retrieved successfully",
      data: []
    });

    render(<UserLikesList />);

    await waitFor(() => {
      expect(screen.getByText("No tienes likes aún")).toBeInTheDocument();
      expect(screen.getByText("Cuando des like a un post, aparecerá aquí")).toBeInTheDocument();
    });
  });

  it("should show likes list when user has likes", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2024-01-01" },
      token: "test-token",
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      clearAuth: vi.fn()
    });

    const mockLikes = [
      {
        id: 22,
        page_url: "test2",
        created_at: "2025-07-28 21:23:25"
      },
      {
        id: 21,
        page_url: "test1",
        created_at: "2025-07-28 21:23:20"
      }
    ];

    mockGetUserLikes.mockResolvedValue({
      success: true,
      message: "Likes retrieved successfully",
      data: mockLikes
    });

    render(<UserLikesList />);

    await waitFor(() => {
      // Verificar que los ArrowCard se renderizan con los títulos correctos
      expect(screen.getByText("test2")).toBeInTheDocument();
      expect(screen.getByText("test1")).toBeInTheDocument();

      // Verificar que los enlaces están correctos
      expect(screen.getByTestId("arrow-card-test2")).toHaveAttribute("href", "/blog/test2");
      expect(screen.getByTestId("arrow-card-test1")).toHaveAttribute("href", "/blog/test1");
    });
  });

  it("should show likes list with formatted titles when page_url contains underscores", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2024-01-01" },
      token: "test-token",
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      clearAuth: vi.fn()
    });

    const mockLikes = [
      {
        id: 22,
        page_url: "test_post_with_underscores",
        created_at: "2025-07-28 21:23:25"
      }
    ];

    mockGetUserLikes.mockResolvedValue({
      success: true,
      message: "Likes retrieved successfully",
      data: mockLikes
    });

    render(<UserLikesList />);

    await waitFor(() => {
      // Verificar que el título se formatea correctamente (underscores reemplazados por espacios)
      expect(screen.getByText("test post with underscores")).toBeInTheDocument();
    });
  });

  it("should show error when API call fails", async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2024-01-01" },
      token: "test-token",
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setLoading: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      clearAuth: vi.fn()
    });

    mockGetUserLikes.mockRejectedValue(new Error("API Error"));

    render(<UserLikesList />);

    await waitFor(() => {
      expect(screen.getByText("Error al cargar los likes")).toBeInTheDocument();
    });
  });
}); 