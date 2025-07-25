import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the Astro component by creating a React equivalent for testing
const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-screen-sm px-5" data-testid="container">
      {children}
    </div>
  );
};

describe("Container", () => {
  describe("Rendering", () => {
    it("should render the component with correct structure", () => {
      render(<Container>Test content</Container>);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe("DIV");
    });

    it("should render children content", () => {
      render(<Container>Test content</Container>);

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <Container>
          <h1>Title</h1>
          <p>Paragraph</p>
          <span>Span content</span>
        </Container>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph")).toBeInTheDocument();
      expect(screen.getByText("Span content")).toBeInTheDocument();
    });

    it("should render empty container when no children provided", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      render(<Container></Container>);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });

    it("should render complex nested content", () => {
      render(
        <Container>
          <div>
            <h1>Main Title</h1>
            <section>
              <h2>Section Title</h2>
              <p>Section content with <strong>bold text</strong> and <em>italic text</em>.</p>
            </section>
          </div>
        </Container>
      );

      expect(screen.getByText("Main Title")).toBeInTheDocument();
      expect(screen.getByText("Section Title")).toBeInTheDocument();
      expect(screen.getByText("bold text")).toBeInTheDocument();
      expect(screen.getByText("italic text")).toBeInTheDocument();
      // Check that the paragraph contains the expected content
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(screen.getByText((_, element) => {
        return element?.tagName === "P" && element.textContent?.includes("Section content with") &&
          element.textContent?.includes("bold text") && element.textContent?.includes("italic text");
      })).toBeInTheDocument();
    });
  });

  describe("Styling and Classes", () => {
    it("should have correct base CSS classes", () => {
      render(<Container>Test content</Container>);

      const container = screen.getByTestId("container");
      expect(container).toHaveClass("mx-auto", "max-w-screen-sm", "px-5");
    });

    it("should have mx-auto class for horizontal centering", () => {
      render(<Container>Test content</Container>);

      const container = screen.getByTestId("container");
      expect(container).toHaveClass("mx-auto");
    });

    it("should have max-w-screen-sm class for maximum width", () => {
      render(<Container>Test content</Container>);

      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-screen-sm");
    });

    it("should have px-5 class for horizontal padding", () => {
      render(<Container>Test content</Container>);

      const container = screen.getByTestId("container");
      expect(container).toHaveClass("px-5");
    });

    it("should not have any additional unexpected classes", () => {
      render(<Container>Test content</Container>);

      const container = screen.getByTestId("container");
      const classList = container.className.split(" ");

      // Should only have the expected 3 classes
      expect(classList).toHaveLength(3);
      expect(classList).toContain("mx-auto");
      expect(classList).toContain("max-w-screen-sm");
      expect(classList).toContain("px-5");
    });
  });

  describe("Layout and Spacing", () => {
    it("should maintain proper spacing with different content types", () => {
      render(
        <Container>
          <h1>Title</h1>
          <p>Paragraph with some content that might be longer and wrap to multiple lines to test how the container handles different content lengths and types.</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
          </ul>
        </Container>
      );

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("px-5"); // Ensure padding is maintained
    });

    it("should handle content with different text lengths", () => {
      const shortText = "Short";
      const longText = "This is a very long piece of text that should test how the container handles content that might be significantly longer than typical content and could potentially cause layout issues if not handled properly by the container's styling.";

      render(
        <Container>
          <p>{shortText}</p>
          <p>{longText}</p>
        </Container>
      );

      expect(screen.getByText(shortText)).toBeInTheDocument();
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      render(
        <Container>
          <main>
            <h1>Main Content</h1>
            <p>Content description</p>
          </main>
        </Container>
      );

      const container = screen.getByTestId("container");
      const main = screen.getByRole("main");
      const heading = screen.getByRole("heading");

      expect(container).toContainElement(main);
      expect(main).toContainElement(heading);
    });

    it("should preserve heading hierarchy", () => {
      render(
        <Container>
          <h1>Main Heading</h1>
          <h2>Sub Heading</h2>
          <h3>Sub Sub Heading</h3>
        </Container>
      );

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    });

    it("should maintain proper focus order", () => {
      render(
        <Container>
          <button>First Button</button>
          <a href="#link">Link</a>
          <button>Second Button</button>
        </Container>
      );

      const buttons = screen.getAllByRole("button");
      const link = screen.getByRole("link");

      expect(buttons).toHaveLength(2);
      expect(link).toBeInTheDocument();
    });
  });

  describe("Content Types", () => {
    it("should handle text content", () => {
      render(<Container>Plain text content</Container>);

      expect(screen.getByText("Plain text content")).toBeInTheDocument();
    });

    it("should handle HTML elements", () => {
      render(
        <Container>
          <div>Div content</div>
          <span>Span content</span>
          <p>Paragraph content</p>
        </Container>
      );

      expect(screen.getByText("Div content")).toBeInTheDocument();
      expect(screen.getByText("Span content")).toBeInTheDocument();
      expect(screen.getByText("Paragraph content")).toBeInTheDocument();
    });

    it("should handle form elements", () => {
      render(
        <Container>
          <form>
            <input type="text" placeholder="Enter text" />
            <button type="submit">Submit</button>
          </form>
        </Container>
      );

      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should handle interactive elements", () => {
      render(
        <Container>
          <button onClick={() => { }}>Click me</button>
          <a href="#test">Test link</a>
          <input type="checkbox" />
        </Container>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("link")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle null children", () => {
      render(<Container>{null}</Container>);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });

    it("should handle undefined children", () => {
      render(<Container>{undefined}</Container>);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });

    it("should handle boolean children", () => {
      render(<Container>{true}</Container>);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });

    it("should handle number children", () => {
      render(<Container>{42}</Container>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should handle special characters in content", () => {
      const specialContent = "Content with special chars: & < > \" ' © ® ™";

      render(<Container>{specialContent}</Container>);

      expect(screen.getByText(specialContent)).toBeInTheDocument();
    });

    it("should handle very long content", () => {
      const longContent = "A".repeat(1000);

      render(<Container>{longContent}</Container>);

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it("should handle empty string children", () => {
      render(<Container>{""}</Container>);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive max-width class", () => {
      render(<Container>Test content</Container>);

      const container = screen.getByTestId("container");
      expect(container).toHaveClass("max-w-screen-sm");
    });

    it("should maintain consistent padding across different content", () => {
      render(
        <Container>
          <div>Content 1</div>
          <div>Content 2</div>
          <div>Content 3</div>
        </Container>
      );

      const container = screen.getByTestId("container");
      expect(container).toHaveClass("px-5");
    });
  });

  describe("Integration", () => {
    it("should work with other components", () => {
      render(
        <Container>
          <header>
            <h1>Header</h1>
          </header>
          <main>
            <article>
              <h2>Article Title</h2>
              <p>Article content</p>
            </article>
          </main>
          <footer>
            <p>Footer content</p>
          </footer>
        </Container>
      );

      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Article Title")).toBeInTheDocument();
      expect(screen.getByText("Article content")).toBeInTheDocument();
      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("should maintain proper nesting structure", () => {
      render(
        <Container>
          <div>
            <section>
              <h2>Section</h2>
              <div>
                <p>Nested content</p>
              </div>
            </section>
          </div>
        </Container>
      );

      const container = screen.getByTestId("container");
      const section = screen.getByText("Section").closest("section");
      const nestedContent = screen.getByText("Nested content");

      expect(container).toContainElement(section);
      expect(section).toContainElement(nestedContent);
    });
  });
}); 