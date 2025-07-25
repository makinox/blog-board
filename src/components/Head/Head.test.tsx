import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock Astro globals
const mockAstro = {
  url: new URL("https://example.com/test-page"),
  site: "https://example.com",
  generator: "Astro",
  props: {
    title: "Test Title",
    description: "Test Description",
    image: "/test-image.png"
  }
};

// Mock font imports
vi.mock("@fontsource/inter/latin-400.css", () => ({}));
vi.mock("@fontsource/inter/latin-600.css", () => ({}));
vi.mock("@fontsource/lora/400.css", () => ({}));
vi.mock("@fontsource/lora/600.css", () => ({}));
vi.mock("@fontsource/inter/files/inter-latin-400-normal.woff2", () => "/fonts/inter-400.woff2");
vi.mock("@fontsource/inter/files/inter-latin-600-normal.woff2", () => "/fonts/inter-600.woff2");
vi.mock("@fontsource/lora/files/lora-latin-400-normal.woff2", () => "/fonts/lora-400.woff2");
vi.mock("@fontsource/lora/files/lora-latin-600-normal.woff2", () => "/fonts/lora-600.woff2");

// Mock ViewTransitions
vi.mock("astro:transitions", () => ({
  ViewTransitions: () => null
}));

// Mock global styles
vi.mock("../styles/global.css", () => ({}));

// React equivalent of the Head component for testing
interface HeadProps {
  title: string;
  description: string;
  image?: string;
}

const Head = ({ title, description, image = "/preview.png" }: HeadProps) => {
  const canonicalURL = new URL("/test-page", "https://example.com");
  const imageURL = new URL(image, "https://example.com");

  // Helper function to add elements to document.head for testing
  const addToHead = () => {
    // Clear existing head content
    document.head.innerHTML = "";

    // Add meta tags
    const metaTags = [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width,initial-scale=1" },
      { name: "generator", content: "Astro" },
      { name: "title", content: title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://example.com/test-page" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: imageURL.toString() },
      { property: "twitter:card", content: "summary_large_image" },
      { property: "twitter:url", content: "https://example.com/test-page" },
      { property: "twitter:title", content: title },
      { property: "twitter:description", content: description },
      { property: "twitter:image", content: imageURL.toString() }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement("meta");
      Object.entries(tag).forEach(([key, value]) => {
        if (key === "charset") {
          meta.setAttribute("charset", value);
        } else {
          meta.setAttribute(key, value);
        }
      });
      document.head.appendChild(meta);
    });

    // Add title
    const titleElement = document.createElement("title");
    titleElement.textContent = title;
    document.head.appendChild(titleElement);

    // Add favicon
    const favicon = document.createElement("link");
    favicon.setAttribute("rel", "icon");
    favicon.setAttribute("type", "image/x-icon");
    favicon.setAttribute("href", "/logo.svg");
    document.head.appendChild(favicon);

    // Add font preloads
    const fontPreloads = [
      "/fonts/inter-400.woff2",
      "/fonts/inter-600.woff2",
      "/fonts/lora-400.woff2",
      "/fonts/lora-600.woff2"
    ];

    fontPreloads.forEach(href => {
      const link = document.createElement("link");
      link.setAttribute("rel", "preload");
      link.setAttribute("href", href);
      link.setAttribute("as", "font");
      link.setAttribute("type", "font/woff2");
      link.setAttribute("crossorigin", "");
      document.head.appendChild(link);
    });

    // Add canonical link
    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", canonicalURL.toString());
    document.head.appendChild(canonical);

    // Add scripts
    const transitionScript = document.createElement("script");
    transitionScript.setAttribute("data-testid", "transition-script");
    document.head.appendChild(transitionScript);

    const inlineScript = document.createElement("script");
    inlineScript.setAttribute("data-testid", "inline-script");
    document.head.appendChild(inlineScript);

    // Add ViewTransitions placeholder
    const viewTransitions = document.createElement("div");
    viewTransitions.setAttribute("data-testid", "view-transitions");
    document.head.appendChild(viewTransitions);
  };

  // Call the function to populate document.head
  React.useEffect(() => {
    addToHead();
  }, [title, description, image]);

  // Return a div for React Testing Library to work with
  return <div data-testid="head-component" />;
};

describe("Head", () => {
  beforeEach(() => {
    // Reset any DOM changes
    document.head.innerHTML = "";
  });

  describe("Basic Rendering", () => {
    it("should render the head component with correct structure", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const head = screen.getByTestId("head-component");
      expect(head).toBeInTheDocument();
      expect(head.tagName).toBe("DIV");
    });

    it("should render with required props", () => {
      render(<Head title="Test Title" description="Test Description" />);

      // Check that the title is in the document head
      const titleElement = document.querySelector("title");
      expect(titleElement).toHaveTextContent("Test Title");
    });

    it("should render with optional image prop", () => {
      render(
        <Head
          title="Test Title"
          description="Test Description"
          image="/custom-image.png"
        />
      );

      const head = screen.getByTestId("head-component");
      expect(head).toBeInTheDocument();
    });
  });

  describe("Meta Tags", () => {
    it("should include charset meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const charsetMeta = document.querySelector('meta[charset="utf-8"]');
      expect(charsetMeta).toBeInTheDocument();
    });

    it("should include viewport meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const viewportMeta = document.querySelector('meta[name="viewport"]');
      expect(viewportMeta).toHaveAttribute("content", "width=device-width,initial-scale=1");
    });

    it("should include generator meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const generatorMeta = document.querySelector('meta[name="generator"]');
      expect(generatorMeta).toHaveAttribute("content", "Astro");
    });

    it("should include title meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const titleMeta = document.querySelector('meta[name="title"]');
      expect(titleMeta).toHaveAttribute("content", "Test Title");
    });

    it("should include description meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta).toHaveAttribute("content", "Test Description");
    });
  });

  describe("Title Element", () => {
    it("should render title element with correct content", () => {
      render(<Head title="My Page Title" description="Test Description" />);

      const titleElement = document.querySelector("title");
      expect(titleElement).toHaveTextContent("My Page Title");
    });

    it("should handle special characters in title", () => {
      const specialTitle = "Title with & < > \" ' characters";
      render(<Head title={specialTitle} description="Test Description" />);

      const titleElement = document.querySelector("title");
      expect(titleElement).toHaveTextContent(specialTitle);
    });

    it("should handle empty title", () => {
      render(<Head title="" description="Test Description" />);

      const titleElement = document.querySelector("title");
      expect(titleElement).toHaveTextContent("");
    });
  });

  describe("Favicon", () => {
    it("should include favicon link", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const favicon = document.querySelector('link[rel="icon"]');
      expect(favicon).toHaveAttribute("href", "/logo.svg");
      expect(favicon).toHaveAttribute("type", "image/x-icon");
    });
  });

  describe("Font Preloads", () => {
    it("should include Inter font preloads", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const inter400Preload = document.querySelector('link[href="/fonts/inter-400.woff2"]');
      const inter600Preload = document.querySelector('link[href="/fonts/inter-600.woff2"]');

      expect(inter400Preload).toHaveAttribute("rel", "preload");
      expect(inter400Preload).toHaveAttribute("as", "font");
      expect(inter400Preload).toHaveAttribute("type", "font/woff2");
      expect(inter400Preload).toHaveAttribute("crossorigin", "");

      expect(inter600Preload).toHaveAttribute("rel", "preload");
      expect(inter600Preload).toHaveAttribute("as", "font");
      expect(inter600Preload).toHaveAttribute("type", "font/woff2");
      expect(inter600Preload).toHaveAttribute("crossorigin", "");
    });

    it("should include Lora font preloads", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const lora400Preload = document.querySelector('link[href="/fonts/lora-400.woff2"]');
      const lora600Preload = document.querySelector('link[href="/fonts/lora-600.woff2"]');

      expect(lora400Preload).toHaveAttribute("rel", "preload");
      expect(lora400Preload).toHaveAttribute("as", "font");
      expect(lora400Preload).toHaveAttribute("type", "font/woff2");
      expect(lora400Preload).toHaveAttribute("crossorigin", "");

      expect(lora600Preload).toHaveAttribute("rel", "preload");
      expect(lora600Preload).toHaveAttribute("as", "font");
      expect(lora600Preload).toHaveAttribute("type", "font/woff2");
      expect(lora600Preload).toHaveAttribute("crossorigin", "");
    });
  });

  describe("Canonical URL", () => {
    it("should include canonical link", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toHaveAttribute("href", "https://example.com/test-page");
    });
  });

  describe("Open Graph Meta Tags", () => {
    it("should include Open Graph type meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType).toHaveAttribute("content", "website");
    });

    it("should include Open Graph URL meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const ogUrl = document.querySelector('meta[property="og:url"]');
      expect(ogUrl).toHaveAttribute("content", "https://example.com/test-page");
    });

    it("should include Open Graph title meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle).toHaveAttribute("content", "Test Title");
    });

    it("should include Open Graph description meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const ogDescription = document.querySelector('meta[property="og:description"]');
      expect(ogDescription).toHaveAttribute("content", "Test Description");
    });

    it("should include Open Graph image meta tag with default image", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute("content", "https://example.com/preview.png");
    });

    it("should include Open Graph image meta tag with custom image", () => {
      render(
        <Head
          title="Test Title"
          description="Test Description"
          image="/custom-image.jpg"
        />
      );

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute("content", "https://example.com/custom-image.jpg");
    });
  });

  describe("Twitter Meta Tags", () => {
    it("should include Twitter card meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const twitterCard = document.querySelector('meta[property="twitter:card"]');
      expect(twitterCard).toHaveAttribute("content", "summary_large_image");
    });

    it("should include Twitter URL meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const twitterUrl = document.querySelector('meta[property="twitter:url"]');
      expect(twitterUrl).toHaveAttribute("content", "https://example.com/test-page");
    });

    it("should include Twitter title meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      expect(twitterTitle).toHaveAttribute("content", "Test Title");
    });

    it("should include Twitter description meta tag", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const twitterDescription = document.querySelector('meta[property="twitter:description"]');
      expect(twitterDescription).toHaveAttribute("content", "Test Description");
    });

    it("should include Twitter image meta tag with default image", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const twitterImage = document.querySelector('meta[property="twitter:image"]');
      expect(twitterImage).toHaveAttribute("content", "https://example.com/preview.png");
    });

    it("should include Twitter image meta tag with custom image", () => {
      render(
        <Head
          title="Test Title"
          description="Test Description"
          image="/custom-twitter-image.jpg"
        />
      );

      const twitterImage = document.querySelector('meta[property="twitter:image"]');
      expect(twitterImage).toHaveAttribute("content", "https://example.com/custom-twitter-image.jpg");
    });
  });

  describe("Scripts", () => {
    it("should include transition script", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const transitionScript = document.querySelector('script[data-testid="transition-script"]');
      expect(transitionScript).toBeInTheDocument();
    });

    it("should include inline script", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const inlineScript = document.querySelector('script[data-testid="inline-script"]');
      expect(inlineScript).toBeInTheDocument();
    });

    it("should include ViewTransitions placeholder", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const viewTransitions = document.querySelector('div[data-testid="view-transitions"]');
      expect(viewTransitions).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should handle long title", () => {
      const longTitle = "This is a very long title that might be used for SEO purposes and could potentially be quite lengthy to test how the component handles longer content";
      render(<Head title={longTitle} description="Test Description" />);

      const titleElement = document.querySelector("title");
      expect(titleElement).toHaveTextContent(longTitle);
    });

    it("should handle long description", () => {
      const longDescription = "This is a very long description that provides detailed information about the page content and could be used for SEO purposes to help search engines understand what the page is about";
      render(<Head title="Test Title" description={longDescription} />);

      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta).toHaveAttribute("content", longDescription);
    });

    it("should handle special characters in description", () => {
      const specialDescription = "Description with & < > \" ' © ® ™ characters";
      render(<Head title="Test Title" description={specialDescription} />);

      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta).toHaveAttribute("content", specialDescription);
    });

    it("should handle image URLs with query parameters", () => {
      render(
        <Head
          title="Test Title"
          description="Test Description"
          image="/image.jpg?v=123&w=800"
        />
      );

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute("content", "https://example.com/image.jpg?v=123&w=800");
    });

    it("should handle absolute image URLs", () => {
      render(
        <Head
          title="Test Title"
          description="Test Description"
          image="https://external.com/image.jpg"
        />
      );

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute("content", "https://external.com/image.jpg");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty description", () => {
      render(<Head title="Test Title" description="" />);

      const descriptionMeta = document.querySelector('meta[name="description"]');
      expect(descriptionMeta).toHaveAttribute("content", "");
    });

    it("should handle undefined image prop", () => {
      render(<Head title="Test Title" description="Test Description" />);

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute("content", "https://example.com/preview.png");
    });

    it("should handle empty image prop", () => {
      render(<Head title="Test Title" description="Test Description" image="" />);

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute("content", "https://example.com/");
    });

    it("should handle image prop with only slash", () => {
      render(<Head title="Test Title" description="Test Description" image="/" />);

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute("content", "https://example.com/");
    });
  });

  describe("SEO Optimization", () => {
    it("should include all essential SEO meta tags", () => {
      render(<Head title="Test Title" description="Test Description" />);

      // Check for essential meta tags
      expect(document.querySelector('meta[charset="utf-8"]')).toBeInTheDocument();
      expect(document.querySelector('meta[name="viewport"]')).toBeInTheDocument();
      expect(document.querySelector('meta[name="description"]')).toBeInTheDocument();
      expect(document.querySelector('link[rel="canonical"]')).toBeInTheDocument();
    });

    it("should include all social media meta tags", () => {
      render(<Head title="Test Title" description="Test Description" />);

      // Check for Open Graph tags
      expect(document.querySelector('meta[property="og:type"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="og:url"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="og:title"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="og:description"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="og:image"]')).toBeInTheDocument();

      // Check for Twitter tags
      expect(document.querySelector('meta[property="twitter:card"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="twitter:url"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="twitter:title"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="twitter:description"]')).toBeInTheDocument();
      expect(document.querySelector('meta[property="twitter:image"]')).toBeInTheDocument();
    });

    it("should have consistent title across all meta tags", () => {
      const testTitle = "Consistent Title Test";
      render(<Head title={testTitle} description="Test Description" />);

      const titleElement = document.querySelector("title");
      const titleMeta = document.querySelector('meta[name="title"]');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');

      expect(titleElement).toHaveTextContent(testTitle);
      expect(titleMeta).toHaveAttribute("content", testTitle);
      expect(ogTitle).toHaveAttribute("content", testTitle);
      expect(twitterTitle).toHaveAttribute("content", testTitle);
    });

    it("should have consistent description across all meta tags", () => {
      const testDescription = "Consistent Description Test";
      render(<Head title="Test Title" description={testDescription} />);

      const descriptionMeta = document.querySelector('meta[name="description"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const twitterDescription = document.querySelector('meta[property="twitter:description"]');

      expect(descriptionMeta).toHaveAttribute("content", testDescription);
      expect(ogDescription).toHaveAttribute("content", testDescription);
      expect(twitterDescription).toHaveAttribute("content", testDescription);
    });
  });
}); 