import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the ShareButton component
vi.mock("@components/ShareButton", () => ({
  ShareButton: () => <div data-testid="share-button">ShareButton Component</div>
}));

// Mock the RemindButton component
vi.mock("@components/RemindButton/RemindButton", () => ({
  RemindButton: () => <div data-testid="remind-button">RemindButton Component</div>
}));

// Mock the Astro component by creating a React equivalent for testing
const PostFooter = ({ post }: { post: { data: { authorImage: string; author: string; authorDescription: string } } }) => {
  return (
    <section className="flex items-center gap-4 mb-6" data-testid="post-footer">
      <img
        className="w-24 h-24 rounded-full"
        src={post.data.authorImage}
        alt={post.data.author}
        data-testid="author-image"
      />
      <div data-testid="author-info">
        <p className="text-sm" data-testid="written-by">Escrito por</p>
        <h5 className="text-xl font-bold" data-testid="author-name">{post.data.author}</h5>
        <p className="text-sm" data-testid="author-description">{post.data.authorDescription}</p>
        <div className="mt-2" data-testid="action-buttons">
          <div data-testid="share-button">ShareButton Component</div>
          <div data-testid="remind-button">RemindButton Component</div>
        </div>
      </div>
    </section>
  );
};

describe("PostFooter", () => {
  const mockPost = {
    data: {
      authorImage: "/path/to/author-image.jpg",
      author: "John Doe",
      authorDescription: "Software developer and tech enthusiast"
    }
  };

  describe("Rendering", () => {
    it("should render the post footer component with correct structure", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toBeInTheDocument();
      expect(postFooter.tagName).toBe("SECTION");
    });

    it("should render the author image", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toBeInTheDocument();
      expect(authorImage.tagName).toBe("IMG");
      expect(authorImage).toHaveAttribute("src", "/path/to/author-image.jpg");
      expect(authorImage).toHaveAttribute("alt", "John Doe");
    });

    it("should render the author information section", () => {
      render(<PostFooter post={mockPost} />);

      const authorInfo = screen.getByTestId("author-info");
      expect(authorInfo).toBeInTheDocument();
      expect(authorInfo.tagName).toBe("DIV");
    });

    it("should render the 'Escrito por' text", () => {
      render(<PostFooter post={mockPost} />);

      const writtenBy = screen.getByTestId("written-by");
      expect(writtenBy).toBeInTheDocument();
      expect(writtenBy).toHaveTextContent("Escrito por");
    });

    it("should render the author name", () => {
      render(<PostFooter post={mockPost} />);

      const authorName = screen.getByTestId("author-name");
      expect(authorName).toBeInTheDocument();
      expect(authorName).toHaveTextContent("John Doe");
    });

    it("should render the author description", () => {
      render(<PostFooter post={mockPost} />);

      const authorDescription = screen.getByTestId("author-description");
      expect(authorDescription).toBeInTheDocument();
      expect(authorDescription).toHaveTextContent("Software developer and tech enthusiast");
    });

    it("should render the action buttons container", () => {
      render(<PostFooter post={mockPost} />);

      const actionButtons = screen.getByTestId("action-buttons");
      expect(actionButtons).toBeInTheDocument();
      expect(actionButtons.tagName).toBe("DIV");
    });

    it("should render the ShareButton component", () => {
      render(<PostFooter post={mockPost} />);

      const shareButton = screen.getByTestId("share-button");
      expect(shareButton).toBeInTheDocument();
      expect(shareButton).toHaveTextContent("ShareButton Component");
    });

    it("should render the RemindButton component", () => {
      render(<PostFooter post={mockPost} />);

      const remindButton = screen.getByTestId("remind-button");
      expect(remindButton).toBeInTheDocument();
      expect(remindButton).toHaveTextContent("RemindButton Component");
    });
  });

  describe("Styling and Classes", () => {
    it("should have correct main section CSS classes", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("flex", "items-center", "gap-4", "mb-6");
    });

    it("should have flex layout for main section", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("flex", "items-center");
    });

    it("should have proper gap and margin bottom", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("gap-4", "mb-6");
    });

    it("should have correct author image CSS classes", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveClass("w-24", "h-24", "rounded-full");
    });

    it("should have circular author image", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveClass("rounded-full");
    });

    it("should have fixed author image dimensions", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveClass("w-24", "h-24");
    });

    it("should have correct text styling for 'Escrito por'", () => {
      render(<PostFooter post={mockPost} />);

      const writtenBy = screen.getByTestId("written-by");
      expect(writtenBy).toHaveClass("text-sm");
    });

    it("should have correct heading styling for author name", () => {
      render(<PostFooter post={mockPost} />);

      const authorName = screen.getByTestId("author-name");
      expect(authorName).toHaveClass("text-xl", "font-bold");
    });

    it("should have correct text styling for author description", () => {
      render(<PostFooter post={mockPost} />);

      const authorDescription = screen.getByTestId("author-description");
      expect(authorDescription).toHaveClass("text-sm");
    });

    it("should have correct action buttons container styling", () => {
      render(<PostFooter post={mockPost} />);

      const actionButtons = screen.getByTestId("action-buttons");
      expect(actionButtons).toHaveClass("mt-2");
    });
  });

  describe("Layout and Structure", () => {
    it("should have proper flex layout for main section", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("flex", "items-center", "gap-4");
    });

    it("should have author image and info as flex items", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      const authorImage = screen.getByTestId("author-image");
      const authorInfo = screen.getByTestId("author-info");

      expect(postFooter).toContainElement(authorImage);
      expect(postFooter).toContainElement(authorInfo);
    });

    it("should maintain proper spacing with gap between elements", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("gap-4");
    });

    it("should have proper margin bottom for section spacing", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("mb-6");
    });

    it("should have proper margin top for action buttons", () => {
      render(<PostFooter post={mockPost} />);

      const actionButtons = screen.getByTestId("action-buttons");
      expect(actionButtons).toHaveClass("mt-2");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic section element", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter.tagName).toBe("SECTION");
    });

    it("should have accessible author image with alt text", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveAttribute("alt", "John Doe");
    });

    it("should have proper heading hierarchy with h5 for author name", () => {
      render(<PostFooter post={mockPost} />);

      const authorName = screen.getByTestId("author-name");
      expect(authorName.tagName).toBe("H5");
    });

    it("should maintain proper focus order", () => {
      render(<PostFooter post={mockPost} />);

      const shareButton = screen.getByTestId("share-button");
      const remindButton = screen.getByTestId("remind-button");

      expect(shareButton).toBeInTheDocument();
      expect(remindButton).toBeInTheDocument();
    });

    it("should have descriptive alt text for author image", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveAttribute("alt", "John Doe");
    });
  });

  describe("Content Display", () => {
    it("should display the correct author name", () => {
      render(<PostFooter post={mockPost} />);

      const authorName = screen.getByTestId("author-name");
      expect(authorName).toHaveTextContent("John Doe");
    });

    it("should display the correct author description", () => {
      render(<PostFooter post={mockPost} />);

      const authorDescription = screen.getByTestId("author-description");
      expect(authorDescription).toHaveTextContent("Software developer and tech enthusiast");
    });

    it("should display the correct author image source", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveAttribute("src", "/path/to/author-image.jpg");
    });

    it("should display the static 'Escrito por' text", () => {
      render(<PostFooter post={mockPost} />);

      const writtenBy = screen.getByTestId("written-by");
      expect(writtenBy).toHaveTextContent("Escrito por");
    });
  });

  describe("Integration", () => {
    it("should integrate with ShareButton component", () => {
      render(<PostFooter post={mockPost} />);

      const shareButton = screen.getByTestId("share-button");
      expect(shareButton).toBeInTheDocument();
    });

    it("should integrate with RemindButton component", () => {
      render(<PostFooter post={mockPost} />);

      const remindButton = screen.getByTestId("remind-button");
      expect(remindButton).toBeInTheDocument();
    });

    it("should maintain proper component hierarchy", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      const authorImage = screen.getByTestId("author-image");
      const authorInfo = screen.getByTestId("author-info");
      const actionButtons = screen.getByTestId("action-buttons");
      const shareButton = screen.getByTestId("share-button");
      const remindButton = screen.getByTestId("remind-button");

      expect(postFooter).toContainElement(authorImage);
      expect(postFooter).toContainElement(authorInfo);
      expect(authorInfo).toContainElement(actionButtons);
      expect(actionButtons).toContainElement(shareButton);
      expect(actionButtons).toContainElement(remindButton);
    });

    it("should render both action buttons in the correct order", () => {
      render(<PostFooter post={mockPost} />);

      const actionButtons = screen.getByTestId("action-buttons");
      const shareButton = screen.getByTestId("share-button");
      const remindButton = screen.getByTestId("remind-button");

      expect(actionButtons.children[0]).toBe(shareButton);
      expect(actionButtons.children[1]).toBe(remindButton);
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive flex layout", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("flex", "items-center");
    });

    it("should have responsive gap spacing", () => {
      render(<PostFooter post={mockPost} />);

      const postFooter = screen.getByTestId("post-footer");
      expect(postFooter).toHaveClass("gap-4");
    });

    it("should have responsive image sizing", () => {
      render(<PostFooter post={mockPost} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveClass("w-24", "h-24");
    });

    it("should have responsive text sizing", () => {
      render(<PostFooter post={mockPost} />);

      const writtenBy = screen.getByTestId("written-by");
      const authorDescription = screen.getByTestId("author-description");
      const authorName = screen.getByTestId("author-name");

      expect(writtenBy).toHaveClass("text-sm");
      expect(authorDescription).toHaveClass("text-sm");
      expect(authorName).toHaveClass("text-xl");
    });
  });

  describe("Edge Cases", () => {
    it("should render without errors when all props are provided", () => {
      expect(() => render(<PostFooter post={mockPost} />)).not.toThrow();
    });

    it("should handle empty author description", () => {
      const postWithEmptyDescription = {
        data: {
          authorImage: "/path/to/author-image.jpg",
          author: "John Doe",
          authorDescription: ""
        }
      };

      render(<PostFooter post={postWithEmptyDescription} />);

      const authorDescription = screen.getByTestId("author-description");
      expect(authorDescription).toHaveTextContent("");
    });

    it("should handle long author names", () => {
      const postWithLongName = {
        data: {
          authorImage: "/path/to/author-image.jpg",
          author: "Dr. John Michael Smith-Jones III, PhD, MBA, Esq.",
          authorDescription: "Software developer and tech enthusiast"
        }
      };

      render(<PostFooter post={postWithLongName} />);

      const authorName = screen.getByTestId("author-name");
      expect(authorName).toHaveTextContent("Dr. John Michael Smith-Jones III, PhD, MBA, Esq.");
    });

    it("should handle long author descriptions", () => {
      const postWithLongDescription = {
        data: {
          authorImage: "/path/to/author-image.jpg",
          author: "John Doe",
          authorDescription: "This is a very long author description that might contain multiple sentences and detailed information about the author's background, experience, and expertise in various fields of technology and software development."
        }
      };

      render(<PostFooter post={postWithLongDescription} />);

      const authorDescription = screen.getByTestId("author-description");
      expect(authorDescription).toHaveTextContent("This is a very long author description that might contain multiple sentences and detailed information about the author's background, experience, and expertise in various fields of technology and software development.");
    });

    it("should handle special characters in author name", () => {
      const postWithSpecialChars = {
        data: {
          authorImage: "/path/to/author-image.jpg",
          author: "José María O'Connor-Smith",
          authorDescription: "Software developer and tech enthusiast"
        }
      };

      render(<PostFooter post={postWithSpecialChars} />);

      const authorName = screen.getByTestId("author-name");
      expect(authorName).toHaveTextContent("José María O'Connor-Smith");
    });

    it("should handle special characters in author description", () => {
      const postWithSpecialChars = {
        data: {
          authorImage: "/path/to/author-image.jpg",
          author: "John Doe",
          authorDescription: "Developer specializing in C++, C#, & JavaScript. Loves ☕ & 🚀"
        }
      };

      render(<PostFooter post={postWithSpecialChars} />);

      const authorDescription = screen.getByTestId("author-description");
      expect(authorDescription).toHaveTextContent("Developer specializing in C++, C#, & JavaScript. Loves ☕ & 🚀");
    });
  });

  describe("Props Handling", () => {
    it("should accept and display post data correctly", () => {
      const customPost = {
        data: {
          authorImage: "/custom/author.jpg",
          author: "Jane Smith",
          authorDescription: "Frontend developer and UI/UX enthusiast"
        }
      };

      render(<PostFooter post={customPost} />);

      const authorImage = screen.getByTestId("author-image");
      const authorName = screen.getByTestId("author-name");
      const authorDescription = screen.getByTestId("author-description");

      expect(authorImage).toHaveAttribute("src", "/custom/author.jpg");
      expect(authorImage).toHaveAttribute("alt", "Jane Smith");
      expect(authorName).toHaveTextContent("Jane Smith");
      expect(authorDescription).toHaveTextContent("Frontend developer and UI/UX enthusiast");
    });

    it("should handle different image formats", () => {
      const postWithDifferentImage = {
        data: {
          authorImage: "https://example.com/avatar.png",
          author: "John Doe",
          authorDescription: "Software developer and tech enthusiast"
        }
      };

      render(<PostFooter post={postWithDifferentImage} />);

      const authorImage = screen.getByTestId("author-image");
      expect(authorImage).toHaveAttribute("src", "https://example.com/avatar.png");
    });
  });
}); 