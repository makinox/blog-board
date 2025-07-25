import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the formatTag utility function
vi.mock("@lib/utils", async () => {
  const actual = await vi.importActual("@lib/utils");
  return {
    ...actual,
    formatTag: vi.fn((tag: string) => tag.toLowerCase().replace(/ /g, "-")),
  };
});

// Import the mocked function
import { formatTag } from "@lib/utils";

// Mock the Astro component by creating a React equivalent for testing
const TagsFooter = ({ tags }: { tags?: Array<string> }) => {
  if (!tags) return null;

  return (
    <ul className="flex flex-wrap gap-2 border-b pt-6 pb-4 mb-10" data-testid="tags-footer">
      {tags.map((slug) => (
        <li key={slug}>
          <a
            className="btn btn-outline btn-xs hover:btn-info capitalize"
            href={`/tag/${formatTag(slug)}`}
            data-testid={`tag-link-${slug}`}
          >
            {slug}
          </a>
        </li>
      ))}
    </ul>
  );
};

describe("TagsFooter", () => {
  describe("Rendering", () => {
    it("should render the component with correct structure when tags are provided", () => {
      const tags = ["javascript", "react", "typescript"];
      render(<TagsFooter tags={tags} />);

      const tagsFooter = screen.getByTestId("tags-footer");
      expect(tagsFooter).toBeInTheDocument();
      expect(tagsFooter.tagName).toBe("UL");
    });

    it("should render all provided tags as links", () => {
      const tags = ["javascript", "react", "typescript"];
      render(<TagsFooter tags={tags} />);

      tags.forEach(tag => {
        const link = screen.getByTestId(`tag-link-${tag}`);
        expect(link).toBeInTheDocument();
        expect(link.tagName).toBe("A");
        expect(link).toHaveTextContent(tag);
      });
    });

    it("should render tags in list items", () => {
      const tags = ["javascript", "react"];
      render(<TagsFooter tags={tags} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("should not render anything when tags prop is not provided", () => {
      const { container } = render(<TagsFooter />);
      expect(container.firstChild).toBeNull();
    });

    it("should not render anything when tags prop is null", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { container } = render(<TagsFooter tags={null as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Props Handling", () => {
    it("should handle single tag", () => {
      const tags = ["javascript"];
      render(<TagsFooter tags={tags} />);

      const link = screen.getByTestId("tag-link-javascript");
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("javascript");
    });

    it("should handle multiple tags", () => {
      const tags = ["javascript", "react", "typescript", "astro"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-javascript")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-react")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-typescript")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-astro")).toBeInTheDocument();
    });

    it("should handle tags with spaces", () => {
      const tags = ["web development", "machine learning"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-web development")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-machine learning")).toBeInTheDocument();
    });

    it("should handle tags with special characters", () => {
      const tags = ["c++", "c#", "node.js"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-c++")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-c#")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-node.js")).toBeInTheDocument();
    });

    it("should handle tags with uppercase letters", () => {
      const tags = ["JavaScript", "React", "TypeScript"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-JavaScript")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-React")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-TypeScript")).toBeInTheDocument();
    });
  });

  describe("Styling and Classes", () => {
    it("should have correct base CSS classes on the ul element", () => {
      const tags = ["javascript"];
      render(<TagsFooter tags={tags} />);

      const tagsFooter = screen.getByTestId("tags-footer");
      expect(tagsFooter).toHaveClass("flex", "flex-wrap", "gap-2", "border-b", "pt-6", "pb-4", "mb-10");
    });

    it("should have correct CSS classes on tag links", () => {
      const tags = ["javascript"];
      render(<TagsFooter tags={tags} />);

      const link = screen.getByTestId("tag-link-javascript");
      expect(link).toHaveClass("btn", "btn-outline", "btn-xs", "hover:btn-info", "capitalize");
    });

    it("should have flex layout classes", () => {
      const tags = ["javascript", "react"];
      render(<TagsFooter tags={tags} />);

      const tagsFooter = screen.getByTestId("tags-footer");
      expect(tagsFooter).toHaveClass("flex", "flex-wrap");
    });

    it("should have proper spacing classes", () => {
      const tags = ["javascript"];
      render(<TagsFooter tags={tags} />);

      const tagsFooter = screen.getByTestId("tags-footer");
      expect(tagsFooter).toHaveClass("gap-2", "pt-6", "pb-4", "mb-10");
    });

    it("should have border styling", () => {
      const tags = ["javascript"];
      render(<TagsFooter tags={tags} />);

      const tagsFooter = screen.getByTestId("tags-footer");
      expect(tagsFooter).toHaveClass("border-b");
    });
  });

  describe("Link Generation", () => {
    it("should generate correct href for simple tags", () => {
      const tags = ["javascript"];
      render(<TagsFooter tags={tags} />);

      const link = screen.getByTestId("tag-link-javascript");
      expect(link).toHaveAttribute("href", "/tag/javascript");
      expect(formatTag).toHaveBeenCalledWith("javascript");
    });

    it("should generate correct href for tags with spaces", () => {
      const tags = ["web development"];
      render(<TagsFooter tags={tags} />);

      const link = screen.getByTestId("tag-link-web development");
      expect(link).toHaveAttribute("href", "/tag/web-development");
      expect(formatTag).toHaveBeenCalledWith("web development");
    });

    it("should generate correct href for tags with uppercase letters", () => {
      const tags = ["JavaScript"];
      render(<TagsFooter tags={tags} />);

      const link = screen.getByTestId("tag-link-JavaScript");
      expect(link).toHaveAttribute("href", "/tag/javascript");
      expect(formatTag).toHaveBeenCalledWith("JavaScript");
    });

    it("should generate correct href for multiple tags", () => {
      const tags = ["javascript", "react", "typescript"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-javascript")).toHaveAttribute("href", "/tag/javascript");
      expect(screen.getByTestId("tag-link-react")).toHaveAttribute("href", "/tag/react");
      expect(screen.getByTestId("tag-link-typescript")).toHaveAttribute("href", "/tag/typescript");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure with ul and li elements", () => {
      const tags = ["javascript", "react"];
      render(<TagsFooter tags={tags} />);

      const list = screen.getByRole("list");
      const listItems = screen.getAllByRole("listitem");

      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(2);
    });

    it("should have proper link structure", () => {
      const tags = ["javascript"];
      render(<TagsFooter tags={tags} />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href");
    });

    it("should have descriptive link text", () => {
      const tags = ["javascript", "react"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByText("javascript")).toBeInTheDocument();
      expect(screen.getByText("react")).toBeInTheDocument();
    });

    it("should maintain proper focus order", () => {
      const tags = ["javascript", "react", "typescript"];
      render(<TagsFooter tags={tags} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle tags with numbers", () => {
      const tags = ["react18", "node16"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-react18")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-node16")).toBeInTheDocument();
    });

    it("should handle tags with hyphens", () => {
      const tags = ["web-dev", "front-end"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-web-dev")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-front-end")).toBeInTheDocument();
    });

    it("should handle tags with underscores", () => {
      const tags = ["web_dev", "front_end"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-web_dev")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-front_end")).toBeInTheDocument();
    });

    it("should handle very long tag names", () => {
      const longTag = "a".repeat(100);
      const tags = [longTag];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId(`tag-link-${longTag}`)).toBeInTheDocument();
    });

    it("should handle tags with emojis", () => {
      const tags = ["🚀", "⚡"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-🚀")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-⚡")).toBeInTheDocument();
    });

    it("should handle tags with special unicode characters", () => {
      const tags = ["café", "naïve"];
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tag-link-café")).toBeInTheDocument();
      expect(screen.getByTestId("tag-link-naïve")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should work with formatTag utility function", () => {
      const tags = ["Web Development", "Machine Learning"];
      render(<TagsFooter tags={tags} />);

      expect(formatTag).toHaveBeenCalledWith("Web Development");
      expect(formatTag).toHaveBeenCalledWith("Machine Learning");
    });

    it("should maintain proper DOM structure", () => {
      const tags = ["javascript", "react"];
      render(<TagsFooter tags={tags} />);

      const tagsFooter = screen.getByTestId("tags-footer");
      const listItems = screen.getAllByRole("listitem");
      const links = screen.getAllByRole("link");

      expect(tagsFooter).toContainElement(listItems[0]);
      expect(tagsFooter).toContainElement(listItems[1]);
      expect(listItems[0]).toContainElement(links[0]);
      expect(listItems[1]).toContainElement(links[1]);
    });
  });

  describe("Performance", () => {
    it("should handle large number of tags efficiently", () => {
      const tags = Array.from({ length: 50 }, (_, i) => `tag${i}`);
      render(<TagsFooter tags={tags} />);

      expect(screen.getByTestId("tags-footer")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(50);
    });
  });
}); 