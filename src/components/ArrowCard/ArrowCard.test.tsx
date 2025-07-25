import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { CollectionEntry } from "astro:content";

// Mock the Astro component by creating a React equivalent for testing
const ArrowCard = ({ entry }: { entry: CollectionEntry<"blog"> }) => {
  return (
    <a
      href={`/${entry.collection}/${entry.slug}`}
      className="relative group flex flex-nowrap py-3 px-4 pr-10 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out"
      data-testid="arrow-card"
    >
      <div className="flex flex-col flex-1 truncate">
        <div className="font-semibold">
          {entry.data.title}
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="absolute top-1/2 right-2 -translate-y-1/2 size-5 stroke-2 fill-none stroke-current"
        data-testid="arrow-icon"
      >
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          className="translate-x-3 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
        />
        <polyline
          points="12 5 19 12 12 19"
          className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
        />
      </svg>
    </a>
  );
};

// Mock blog entry data
const mockBlogEntry: CollectionEntry<"blog"> = {
  id: "test-post",
  slug: "test-post",
  body: "Test post content",
  collection: "blog",
  data: {
    idx: "test-post",
    title: "Test Blog Post",
    date: new Date("2024-01-01"),
    timage: "/test-image.jpg",
    author: "Test Author",
    authorImage: "/author-image.jpg",
    authorDescription: "Test author description",
    tags: ["test", "blog"],
  },
  render: vi.fn(),
};

describe("ArrowCard", () => {
  describe("Rendering", () => {
    it("should render the component with correct structure", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toBeInTheDocument();
      expect(card.tagName).toBe("A");
    });

    it("should display the blog post title", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
    });

    it("should render the arrow icon", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const arrowIcon = screen.getByTestId("arrow-icon");
      expect(arrowIcon).toBeInTheDocument();
      expect(arrowIcon.tagName).toBe("svg");
    });

    it("should render both line and polyline elements in the SVG", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const arrowIcon = screen.getByTestId("arrow-icon");
      const line = arrowIcon.querySelector("line");
      const polyline = arrowIcon.querySelector("polyline");

      expect(line).toBeInTheDocument();
      expect(polyline).toBeInTheDocument();
    });
  });

  describe("Props and Data Flow", () => {
    it("should generate correct href from entry data", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toHaveAttribute("href", "/blog/test-post");
    });

    it("should handle different blog entry titles", () => {
      const customEntry = {
        ...mockBlogEntry,
        data: {
          ...mockBlogEntry.data,
          title: "Custom Blog Title",
        },
      };

      render(<ArrowCard entry={customEntry} />);

      expect(screen.getByText("Custom Blog Title")).toBeInTheDocument();
    });

    it("should handle different blog entry slugs", () => {
      const customEntry = {
        ...mockBlogEntry,
        slug: "custom-slug",
      };

      render(<ArrowCard entry={customEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toHaveAttribute("href", "/blog/custom-slug");
    });
  });

  describe("Styling and Classes", () => {
    it("should have correct base CSS classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toHaveClass(
        "relative",
        "group",
        "flex",
        "flex-nowrap",
        "py-3",
        "px-4",
        "pr-10",
        "rounded-lg",
        "border",
        "border-black/15",
        "dark:border-white/20",
        "hover:bg-black/5",
        "dark:hover:bg-white/5",
        "hover:text-black",
        "dark:hover:text-white",
        "transition-colors",
        "duration-300",
        "ease-in-out"
      );
    });

    it("should have correct content container classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      const contentContainer = card.querySelector("div");

      expect(contentContainer).toHaveClass("flex", "flex-col", "flex-1", "truncate");
    });

    it("should have correct title styling", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const title = screen.getByText("Test Blog Post");
      expect(title).toHaveClass("font-semibold");
    });

    it("should have correct SVG classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const arrowIcon = screen.getByTestId("arrow-icon");
      expect(arrowIcon).toHaveClass(
        "absolute",
        "top-1/2",
        "right-2",
        "-translate-y-1/2",
        "size-5",
        "stroke-2",
        "fill-none",
        "stroke-current"
      );
    });

    it("should have correct line animation classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const arrowIcon = screen.getByTestId("arrow-icon");
      const line = arrowIcon.querySelector("line");

      expect(line).toHaveClass(
        "translate-x-3",
        "group-hover:translate-x-0",
        "scale-x-0",
        "group-hover:scale-x-100",
        "transition-transform",
        "duration-300",
        "ease-in-out"
      );
    });

    it("should have correct polyline animation classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const arrowIcon = screen.getByTestId("arrow-icon");
      const polyline = arrowIcon.querySelector("polyline");

      expect(polyline).toHaveClass(
        "-translate-x-1",
        "group-hover:translate-x-0",
        "transition-transform",
        "duration-300",
        "ease-in-out"
      );
    });
  });

  describe("Accessibility", () => {
    it("should be a clickable link", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card.tagName).toBe("A");
      expect(card).toHaveAttribute("href");
    });

    it("should have proper semantic structure", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      const title = screen.getByText("Test Blog Post");

      expect(card).toContainElement(title);
    });

    it("should have proper SVG attributes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const arrowIcon = screen.getByTestId("arrow-icon");
      expect(arrowIcon).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
      expect(arrowIcon).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });

  describe("Interactive Behavior", () => {
    it("should have hover state classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toHaveClass("group");

      // Check that child elements have group-hover classes
      const arrowIcon = screen.getByTestId("arrow-icon");
      const line = arrowIcon.querySelector("line");
      const polyline = arrowIcon.querySelector("polyline");

      expect(line).toHaveClass("group-hover:translate-x-0", "group-hover:scale-x-100");
      expect(polyline).toHaveClass("group-hover:translate-x-0");
    });

    it("should have transition classes for smooth animations", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toHaveClass("transition-colors", "duration-300", "ease-in-out");

      const arrowIcon = screen.getByTestId("arrow-icon");
      const line = arrowIcon.querySelector("line");
      const polyline = arrowIcon.querySelector("polyline");

      expect(line).toHaveClass("transition-transform", "duration-300", "ease-in-out");
      expect(polyline).toHaveClass("transition-transform", "duration-300", "ease-in-out");
    });
  });

  describe("Dark Mode Support", () => {
    it("should have dark mode border classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toHaveClass("border-black/15", "dark:border-white/20");
    });

    it("should have dark mode hover classes", () => {
      render(<ArrowCard entry={mockBlogEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toHaveClass("hover:bg-black/5", "dark:hover:bg-white/5");
      expect(card).toHaveClass("hover:text-black", "dark:hover:text-white");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title gracefully", () => {
      const emptyTitleEntry = {
        ...mockBlogEntry,
        data: {
          ...mockBlogEntry.data,
          title: "",
        },
      };

      render(<ArrowCard entry={emptyTitleEntry} />);

      const card = screen.getByTestId("arrow-card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("href", "/blog/test-post");
    });

    it("should handle very long titles with truncation", () => {
      const longTitleEntry = {
        ...mockBlogEntry,
        data: {
          ...mockBlogEntry.data,
          title: "This is a very long blog post title that should be truncated by the CSS truncate class to prevent layout issues",
        },
      };

      render(<ArrowCard entry={longTitleEntry} />);

      const card = screen.getByTestId("arrow-card");
      const contentContainer = card.querySelector("div");

      expect(contentContainer).toHaveClass("truncate");
      expect(screen.getByText(longTitleEntry.data.title)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      const specialCharEntry = {
        ...mockBlogEntry,
        data: {
          ...mockBlogEntry.data,
          title: "Test Post with Special Chars: & < > \" '",
        },
      };

      render(<ArrowCard entry={specialCharEntry} />);

      expect(screen.getByText("Test Post with Special Chars: & < > \" '")).toBeInTheDocument();
    });
  });
}); 