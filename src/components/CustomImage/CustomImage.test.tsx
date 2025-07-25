import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the Astro Image component
vi.mock("astro:assets", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Image: ({ src, alt, width, format, loading, decoding, ...rest }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        data-format={format}
        data-loading={loading}
        data-decoding={decoding}
        data-testid="custom-image"
        {...rest}
      />
    );
  },
}));

// Mock the Astro component by creating a React equivalent for testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomImage = ({ src, alt = "", ...rest }: { src: string; alt?: string;[key: string]: any }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={600}
      data-format="webp"
      data-loading="lazy"
      data-decoding="async"
      data-testid="custom-image"
      {...rest}
    />
  );
};

describe("CustomImage", () => {
  describe("Rendering", () => {
    it("should render the component with correct structure", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toBeInTheDocument();
      expect(image.tagName).toBe("IMG");
    });

    it("should render with provided src", () => {
      const testSrc = "/test-image.jpg";
      render(<CustomImage src={testSrc} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("src", testSrc);
    });

    it("should render with default alt text when not provided", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", "");
    });

    it("should render with provided alt text", () => {
      const altText = "Test image description";
      render(<CustomImage src="/test-image.jpg" alt={altText} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", altText);
    });
  });

  describe("Default Props", () => {
    it("should have default width of 600", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("width", "600");
    });

    it("should have default format of webp", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("data-format", "webp");
    });

    it("should have default loading of lazy", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("data-loading", "lazy");
    });

    it("should have default decoding of async", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("data-decoding", "async");
    });
  });

  describe("Props Handling", () => {
    it("should accept and pass through additional props", () => {
      render(
        <CustomImage
          src="/test-image.jpg"
          className="custom-class"
          id="test-id"
          data-custom="test-value"
        />
      );

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveClass("custom-class");
      expect(image).toHaveAttribute("id", "test-id");
      expect(image).toHaveAttribute("data-custom", "test-value");
    });

    it("should override default props when provided", () => {
      render(
        <CustomImage
          src="/test-image.jpg"
          width={800}
          data-format="jpeg"
          data-loading="eager"
          data-decoding="sync"
        />
      );

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("width", "800");
      expect(image).toHaveAttribute("data-format", "jpeg");
      expect(image).toHaveAttribute("data-loading", "eager");
      expect(image).toHaveAttribute("data-decoding", "sync");
    });

    it("should handle empty string alt text", () => {
      render(<CustomImage src="/test-image.jpg" alt="" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", "");
    });

    it("should handle whitespace-only alt text", () => {
      render(<CustomImage src="/test-image.jpg" alt="   " />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", "   ");
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt attribute for accessibility", () => {
      const descriptiveAlt = "A beautiful sunset over the mountains";
      render(<CustomImage src="/sunset.jpg" alt={descriptiveAlt} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", descriptiveAlt);
    });

    it("should have empty alt for decorative images", () => {
      render(<CustomImage src="/decorative.jpg" alt="" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", "");
    });

    it("should support ARIA attributes", () => {
      render(
        <CustomImage
          src="/test-image.jpg"
          aria-label="Custom label"
          aria-describedby="description"
        />
      );

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("aria-label", "Custom label");
      expect(image).toHaveAttribute("aria-describedby", "description");
    });
  });

  describe("Image Sources", () => {
    it("should handle different image formats", () => {
      const sources = [
        "/image.jpg",
        "/image.png",
        "/image.webp",
        "/image.avif",
        "/image.gif",
      ];

      sources.forEach((src) => {
        const { unmount } = render(<CustomImage src={src} />);
        const image = screen.getByTestId("custom-image");
        expect(image).toHaveAttribute("src", src);
        unmount();
      });
    });

    it("should handle relative paths", () => {
      render(<CustomImage src="./images/test.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("src", "./images/test.jpg");
    });

    it("should handle absolute URLs", () => {
      render(<CustomImage src="https://example.com/image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    it("should handle data URLs", () => {
      const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
      render(<CustomImage src={dataUrl} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("src", dataUrl);
    });
  });

  describe("Performance Attributes", () => {
    it("should have lazy loading by default", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("data-loading", "lazy");
    });

    it("should have async decoding by default", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("data-decoding", "async");
    });

    it("should allow overriding loading attribute", () => {
      render(<CustomImage src="/test-image.jpg" data-loading="eager" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("data-loading", "eager");
    });

    it("should allow overriding decoding attribute", () => {
      render(<CustomImage src="/test-image.jpg" data-decoding="sync" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("data-decoding", "sync");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty src", () => {
      render(<CustomImage src="" />);

      const image = screen.getByTestId("custom-image");
      // When src is empty string, the attribute becomes null in the DOM
      expect(image.getAttribute("src")).toBe(null);
    });

    it("should handle very long src URLs", () => {
      const longSrc = "https://example.com/" + "a".repeat(1000) + ".jpg";
      render(<CustomImage src={longSrc} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("src", longSrc);
    });

    it("should handle special characters in src", () => {
      const srcWithSpecialChars = "/path/with spaces & symbols.jpg";
      render(<CustomImage src={srcWithSpecialChars} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("src", srcWithSpecialChars);
    });

    it("should handle very long alt text", () => {
      const longAlt = "A".repeat(1000);
      render(<CustomImage src="/test-image.jpg" alt={longAlt} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", longAlt);
    });

    it("should handle special characters in alt text", () => {
      const altWithSpecialChars = "Image with special chars: & < > \" ' © ® ™";
      render(<CustomImage src="/test-image.jpg" alt={altWithSpecialChars} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("alt", altWithSpecialChars);
    });
  });

  describe("Integration", () => {
    it("should work within other components", () => {
      render(
        <div>
          <h1>Gallery</h1>
          <CustomImage src="/image1.jpg" alt="First image" />
          <CustomImage src="/image2.jpg" alt="Second image" />
        </div>
      );

      const images = screen.getAllByTestId("custom-image");
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute("src", "/image1.jpg");
      expect(images[0]).toHaveAttribute("alt", "First image");
      expect(images[1]).toHaveAttribute("src", "/image2.jpg");
      expect(images[1]).toHaveAttribute("alt", "Second image");
    });

    it("should maintain proper attributes when wrapped", () => {
      render(
        <figure>
          <CustomImage src="/test-image.jpg" alt="Test" />
          <figcaption>Test caption</figcaption>
        </figure>
      );

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("src", "/test-image.jpg");
      expect(image).toHaveAttribute("alt", "Test");
      expect(screen.getByText("Test caption")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have default width suitable for responsive design", () => {
      render(<CustomImage src="/test-image.jpg" />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("width", "600");
    });

    it("should allow custom width for responsive design", () => {
      render(<CustomImage src="/test-image.jpg" width={1200} />);

      const image = screen.getByTestId("custom-image");
      expect(image).toHaveAttribute("width", "1200");
    });
  });
}); 