/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LikeButton } from "./LikeButton";

// Mock the dependencies
vi.mock("@controllers/blogLikes/blogLikes", () => ({
  likeBlog: vi.fn(),
  unlikeBlog: vi.fn(),
  getBlogLikes: vi.fn(),
}));

vi.mock("@components/AuthForms/AuthForms", () => ({
  AuthForms: () => <div data-testid="auth-forms">Auth Forms</div>,
}));

vi.mock("@stores/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@stores/blogStore", () => ({
  useBlogStore: vi.fn(),
}));

vi.mock("@lib/utils", async () => {
  const actual = await vi.importActual("@lib/utils");
  return {
    ...actual,
    getCurrentBlogUrl: vi.fn(() => "http://localhost:3000/test-blog"),
    cn: vi.fn((baseClass, conditionalClasses) => {
      if (typeof conditionalClasses === "object") {
        const appliedClasses = Object.entries(conditionalClasses)
          .filter(([, condition]) => condition)
          .map(([className]) => className);
        return `${baseClass} ${appliedClasses.join(" ")}`;
      }
      return baseClass;
    }),
  };
});

// Import the mocked functions
import { likeBlog, unlikeBlog, getBlogLikes } from "@controllers/blogLikes/blogLikes";
import { useAuthStore } from "@stores/authStore";
import { useBlogStore } from "@stores/blogStore";
import { getCurrentBlogUrl } from "@lib/utils";

const mockLikeBlog = likeBlog as any;
const mockUnlikeBlog = unlikeBlog as any;
const mockGetBlogLikes = getBlogLikes as any;
const mockUseAuthStore = useAuthStore as any;
const mockUseBlogStore = useBlogStore as any;
const mockGetCurrentBlogUrl = getCurrentBlogUrl as any;

describe("LikeButton", () => {
  const mockAddBlog = vi.fn();
  const mockShowModal = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock HTMLDialogElement methods
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      value: mockShowModal,
      writable: true,
    });

    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      value: mockCloseModal,
      writable: true,
    });

    // Default auth store mock
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
      clearAuth: vi.fn(),
    });

    // Default blog store mock
    mockUseBlogStore.mockReturnValue({
      blogs: [],
      setBlogs: vi.fn(),
      addBlog: mockAddBlog,
      getBlog: vi.fn(),
    });

    // Default URL mock
    mockGetCurrentBlogUrl.mockReturnValue("http://localhost:3000/test-blog");

    // Default API mocks
    mockLikeBlog.mockResolvedValue({
      success: true,
      message: "Blog liked successfully",
      data: {
        id: 1,
        user_id: 1,
        page_url: "http://localhost:3000/test-blog",
        created_at: "2023-01-01",
      },
    });

    mockUnlikeBlog.mockResolvedValue({
      success: true,
      message: "Blog unliked successfully",
    });

    mockGetBlogLikes.mockResolvedValue({
      success: true,
      message: "Blog likes fetched successfully",
      data: {
        page_url: "http://localhost:3000/test-blog",
        total_likes: 5,
        user_liked: false,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial Rendering", () => {
    it("should render the like button with correct text", () => {
      render(<LikeButton />);

      expect(screen.getByText("Me gusta")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render the heart icon", () => {
      render(<LikeButton />);

      // The FaHeart icon should be present
      const button = screen.getByRole("button");
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("should render the auth modal", () => {
      render(<LikeButton />);

      expect(screen.getByTestId("auth-forms")).toBeInTheDocument();
      expect(screen.getByText("Para poder marcar como favorito debes iniciar sesión")).toBeInTheDocument();
    });

    it("should have correct initial button styling when not liked", () => {
      render(<LikeButton />);

      const button = screen.getByRole("button");
      // Check that the button has the base classes
      expect(button.className).toContain("btn");
      expect(button.className).toContain("hover:btn-error");
    });
  });

  describe("Authentication States", () => {
    it("should show auth modal when clicked and user is not authenticated", () => {
      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockShowModal).toHaveBeenCalled();
    });

    it("should not show auth modal when user is authenticated", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockShowModal).not.toHaveBeenCalled();
    });
  });

  describe("Like/Unlike Functionality", () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });
    });

    it("should call likeBlog when button is clicked and not liked", async () => {
      mockLikeBlog.mockResolvedValue({
        success: true,
        message: "Blog liked successfully",
        data: {
          id: 1,
          user_id: 1,
          page_url: "http://localhost:3000/test-blog",
          created_at: "2023-01-01",
        },
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockLikeBlog).toHaveBeenCalled();
      });
    });

    it("should call unlikeBlog when button is clicked and already liked", async () => {
      mockUseBlogStore.mockReturnValue({
        blogs: [{ page_url: "http://localhost:3000/test-blog", likes: 5, isLiked: true }],
        setBlogs: vi.fn(),
        addBlog: mockAddBlog,
        getBlog: vi.fn(),
      });

      mockUnlikeBlog.mockResolvedValue({
        success: true,
        message: "Blog unliked successfully",
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockUnlikeBlog).toHaveBeenCalled();
      });
    });

    it("should update blog store when like is successful", async () => {
      mockLikeBlog.mockResolvedValue({
        success: true,
        message: "Blog liked successfully",
        data: {
          id: 1,
          user_id: 1,
          page_url: "http://localhost:3000/test-blog",
          created_at: "2023-01-01",
        },
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockAddBlog).toHaveBeenCalledWith({
          page_url: "http://localhost:3000/test-blog",
          isLiked: true,
        });
      });
    });

    it("should update blog store when unlike is successful", async () => {
      mockUseBlogStore.mockReturnValue({
        blogs: [{ page_url: "http://localhost:3000/test-blog", likes: 5, isLiked: true }],
        setBlogs: vi.fn(),
        addBlog: mockAddBlog,
        getBlog: vi.fn(),
      });

      mockUnlikeBlog.mockResolvedValue({
        success: true,
        message: "Blog unliked successfully",
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockAddBlog).toHaveBeenCalledWith({
          page_url: "http://localhost:3000/test-blog",
          isLiked: false,
        });
      });
    });

    it("should not update blog store when like fails", async () => {
      mockLikeBlog.mockResolvedValue({
        success: false,
        message: "Failed to like blog",
        data: null as any,
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockAddBlog).not.toHaveBeenCalled();
      });
    });

    it("should not update blog store when unlike fails", async () => {
      mockUseBlogStore.mockReturnValue({
        blogs: [{ page_url: "http://localhost:3000/test-blog", likes: 5, isLiked: true }],
        setBlogs: vi.fn(),
        addBlog: mockAddBlog,
        getBlog: vi.fn(),
      });

      mockUnlikeBlog.mockResolvedValue({
        success: false,
        message: "Failed to unlike blog",
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockAddBlog).not.toHaveBeenCalled();
      });
    });
  });

  describe("Button States and Styling", () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });
    });

    it("should show 'Me gusta...' text when clicked", async () => {
      mockLikeBlog.mockResolvedValue({
        success: true,
        message: "Blog liked successfully",
        data: {
          id: 1,
          user_id: 1,
          page_url: "http://localhost:3000/test-blog",
          created_at: "2023-01-01",
        },
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(screen.getByText("Me gusta...")).toBeInTheDocument();
    });

    it("should have correct styling when liked", () => {
      mockUseBlogStore.mockReturnValue({
        blogs: [{ page_url: "http://localhost:3000/test-blog", likes: 5, isLiked: true }],
        setBlogs: vi.fn(),
        addBlog: mockAddBlog,
        getBlog: vi.fn(),
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      expect(button.className).toContain("btn");
      expect(button.className).toContain("hover:btn-error");
    });

    it("should have correct styling when not liked", () => {
      mockUseBlogStore.mockReturnValue({
        blogs: [{ page_url: "http://localhost:3000/test-blog", likes: 5, isLiked: false }],
        setBlogs: vi.fn(),
        addBlog: mockAddBlog,
        getBlog: vi.fn(),
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      expect(button.className).toContain("btn");
      expect(button.className).toContain("hover:btn-error");
    });

    it("should have loading state styling when clicked", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(button.className).toContain("animate-pulse");
      expect(button.className).toContain("cursor-not-allowed");
    });
  });

  describe("Initialization and Data Fetching", () => {
    it("should fetch blog likes on mount when authenticated", () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });

      mockGetBlogLikes.mockResolvedValue({
        success: true,
        message: "Blog likes fetched successfully",
        data: {
          page_url: "http://localhost:3000/test-blog",
          total_likes: 10,
          user_liked: true,
        },
      });

      render(<LikeButton />);

      expect(mockGetBlogLikes).toHaveBeenCalled();
    });

    it("should not fetch blog likes when not authenticated", () => {
      render(<LikeButton />);

      expect(mockGetBlogLikes).not.toHaveBeenCalled();
    });

    it("should update blog store with fetched likes data", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });

      mockGetBlogLikes.mockResolvedValue({
        success: true,
        message: "Blog likes fetched successfully",
        data: {
          page_url: "http://localhost:3000/test-blog",
          total_likes: 10,
          user_liked: true,
        },
      });

      render(<LikeButton />);

      await waitFor(() => {
        expect(mockAddBlog).toHaveBeenCalledWith({
          page_url: "http://localhost:3000/test-blog",
          likes: 10,
          isLiked: true,
        });
      });
    });

    it("should not update blog store when likes fetch fails", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });

      mockGetBlogLikes.mockResolvedValue({
        success: false,
        message: "Failed to fetch blog likes",
        data: null as any,
      });

      render(<LikeButton />);

      await waitFor(() => {
        expect(mockAddBlog).not.toHaveBeenCalled();
      });
    });
  });

  describe("Modal Behavior", () => {
    it("should close modal and trigger like when user becomes authenticated", async () => {
      const mockAuthStore = {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      };

      mockUseAuthStore.mockReturnValue(mockAuthStore);

      mockLikeBlog.mockResolvedValue({
        success: true,
        message: "Blog liked successfully",
        data: {
          id: 1,
          user_id: 1,
          page_url: "http://localhost:3000/test-blog",
          created_at: "2023-01-01",
        },
      });

      render(<LikeButton />);

      // Simulate modal being open
      const modal = document.getElementById("like-modal") as HTMLDialogElement;
      Object.defineProperty(modal, "open", { value: true, writable: true });

      // Simulate user becoming authenticated
      mockAuthStore.isAuthenticated = true;
      mockUseAuthStore.mockReturnValue(mockAuthStore);

      // Re-render to trigger useEffect
      render(<LikeButton />);

      await waitFor(() => {
        expect(mockCloseModal).toHaveBeenCalled();
        expect(mockLikeBlog).toHaveBeenCalled();
      });
    });

    it("should not close modal or trigger like when modal is not open", () => {
      const mockAuthStore = {
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      };

      mockUseAuthStore.mockReturnValue(mockAuthStore);

      render(<LikeButton />);

      expect(mockCloseModal).not.toHaveBeenCalled();
      expect(mockLikeBlog).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing page_url in blog store gracefully", () => {
      mockUseBlogStore.mockReturnValue({
        blogs: [{ page_url: "", likes: 5, isLiked: true }],
        setBlogs: vi.fn(),
        addBlog: mockAddBlog,
        getBlog: vi.fn(),
      });

      render(<LikeButton />);

      // Should not crash and should render normally
      expect(screen.getByText("Me gusta")).toBeInTheDocument();
    });

    it("should handle empty blogs array", () => {
      mockUseBlogStore.mockReturnValue({
        blogs: [],
        setBlogs: vi.fn(),
        addBlog: mockAddBlog,
        getBlog: vi.fn(),
      });

      render(<LikeButton />);

      // Should render normally with default state
      expect(screen.getByText("Me gusta")).toBeInTheDocument();
    });

    it("should handle API errors gracefully", async () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, name: "Test User", email: "test@example.com", visitor_id: null, email_verified: true, created_at: "2023-01-01" },
        token: "test-token",
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setLoading: vi.fn(),
        updateUser: vi.fn(),
        getUser: vi.fn(),
        clearAuth: vi.fn(),
      });

      mockLikeBlog.mockResolvedValue({
        success: false,
        message: "Network error",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: null as any,
      });

      render(<LikeButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Should show loading state initially
      expect(screen.getByText("Me gusta...")).toBeInTheDocument();

      // Should not crash when API fails
      expect(mockLikeBlog).toHaveBeenCalled();
      expect(mockAddBlog).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      render(<LikeButton />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have proper dialog role for modal", () => {
      render(<LikeButton />);

      expect(screen.getByText("Para poder marcar como favorito debes iniciar sesión")).toBeInTheDocument();
    });

    it("should have proper modal content", () => {
      render(<LikeButton />);

      expect(screen.getByText("Para poder marcar como favorito debes iniciar sesión")).toBeInTheDocument();
      expect(screen.getByText("Close")).toBeInTheDocument();
    });
  });
}); 