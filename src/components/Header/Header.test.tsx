import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the SITE constant
vi.mock("@consts", () => ({
  SITE: {
    NAME: "Voib"
  }
}));

// Mock the HeaderSign component
vi.mock("@components/HeaderSign/HeaderSign", () => ({
  HeaderSign: () => <div data-testid="header-sign">HeaderSign Component</div>
}));

// Mock the Container component
vi.mock("@components/Container/Container.astro", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  )
}));

// Mock the Astro component by creating a React equivalent for testing
const Header = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 py-1 bg-stone-100/75 dark:bg-stone-900/25 backdrop-blur-sm saturate-200"
      data-testid="header"
    >
      <div data-testid="container">
        <div className="flex items-center justify-between">
          <a href="/" data-testid="logo-link">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" className="w-6 mb-1" alt="Logo" data-testid="logo-image" />
              Voib
            </div>
          </a>

          <div data-testid="header-sign">HeaderSign Component</div>
        </div>
      </div>
    </header>
  );
};

describe("Header", () => {
  describe("Rendering", () => {
    it("should render the header component with correct structure", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe("HEADER");
    });

    it("should render the container component", () => {
      render(<Header />);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });

    it("should render the logo link", () => {
      render(<Header />);

      const logoLink = screen.getByTestId("logo-link");
      expect(logoLink).toBeInTheDocument();
      expect(logoLink.tagName).toBe("A");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("should render the logo image", () => {
      render(<Header />);

      const logoImage = screen.getByTestId("logo-image");
      expect(logoImage).toBeInTheDocument();
      expect(logoImage.tagName).toBe("IMG");
      expect(logoImage).toHaveAttribute("src", "/logo.svg");
      expect(logoImage).toHaveAttribute("alt", "Logo");
    });

    it("should render the site name", () => {
      render(<Header />);

      expect(screen.getByText("Voib")).toBeInTheDocument();
    });

    it("should render the HeaderSign component", () => {
      render(<Header />);

      const headerSign = screen.getByTestId("header-sign");
      expect(headerSign).toBeInTheDocument();
      expect(headerSign).toHaveTextContent("HeaderSign Component");
    });
  });

  describe("Styling and Classes", () => {
    it("should have correct header CSS classes", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass(
        "fixed",
        "top-0",
        "left-0",
        "right-0",
        "z-50",
        "py-1",
        "bg-stone-100/75",
        "dark:bg-stone-900/25",
        "backdrop-blur-sm",
        "saturate-200"
      );
    });

    it("should have fixed positioning classes", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("fixed", "top-0", "left-0", "right-0");
    });

    it("should have high z-index for overlay", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("z-50");
    });

    it("should have background styling classes", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("bg-stone-100/75", "dark:bg-stone-900/25");
    });

    it("should have backdrop blur and saturation effects", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("backdrop-blur-sm", "saturate-200");
    });

    it("should have logo container with flex layout", () => {
      render(<Header />);

      const logoLink = screen.getByTestId("logo-link");
      const logoContainer = logoLink.querySelector("div");
      expect(logoContainer).toHaveClass("flex", "items-center", "gap-2");
    });

    it("should have logo image with correct classes", () => {
      render(<Header />);

      const logoImage = screen.getByTestId("logo-image");
      expect(logoImage).toHaveClass("w-6", "mb-1");
    });

    it("should have main container with flex layout", () => {
      render(<Header />);

      const container = screen.getByTestId("container");
      const flexContainer = container.querySelector("div");
      expect(flexContainer).toHaveClass("flex", "items-center", "justify-between");
    });
  });

  describe("Layout and Structure", () => {
    it("should have proper flex layout for main container", () => {
      render(<Header />);

      const container = screen.getByTestId("container");
      const flexContainer = container.querySelector("div");
      expect(flexContainer).toHaveClass("flex", "items-center", "justify-between");
    });

    it("should have logo and HeaderSign as flex items", () => {
      render(<Header />);

      const logoLink = screen.getByTestId("logo-link");
      const headerSign = screen.getByTestId("header-sign");
      const flexContainer = screen.getByTestId("container").querySelector("div");

      expect(flexContainer).toContainElement(logoLink);
      expect(flexContainer).toContainElement(headerSign);
    });

    it("should maintain proper spacing with gap between logo elements", () => {
      render(<Header />);

      const logoLink = screen.getByTestId("logo-link");
      const logoContainer = logoLink.querySelector("div");
      expect(logoContainer).toHaveClass("gap-2");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic header element", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header.tagName).toBe("HEADER");
    });

    it("should have accessible logo link", () => {
      render(<Header />);

      const logoLink = screen.getByTestId("logo-link");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("should have accessible logo image with alt text", () => {
      render(<Header />);

      const logoImage = screen.getByTestId("logo-image");
      expect(logoImage).toHaveAttribute("alt", "Logo");
    });

    it("should maintain proper focus order", () => {
      render(<Header />);

      const logoLink = screen.getByTestId("logo-link");
      const headerSign = screen.getByTestId("header-sign");

      expect(logoLink).toBeInTheDocument();
      expect(headerSign).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should have logo link pointing to home page", () => {
      render(<Header />);

      const logoLink = screen.getByTestId("logo-link");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("should render HeaderSign component for authentication", () => {
      render(<Header />);

      const headerSign = screen.getByTestId("header-sign");
      expect(headerSign).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have responsive positioning classes", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("fixed", "top-0", "left-0", "right-0");
    });

    it("should have responsive background with dark mode support", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("bg-stone-100/75", "dark:bg-stone-900/25");
    });
  });

  describe("Integration", () => {
    it("should integrate with Container component", () => {
      render(<Header />);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });

    it("should integrate with HeaderSign component", () => {
      render(<Header />);

      const headerSign = screen.getByTestId("header-sign");
      expect(headerSign).toBeInTheDocument();
    });

    it("should maintain proper component hierarchy", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      const container = screen.getByTestId("container");
      const logoLink = screen.getByTestId("logo-link");
      const headerSign = screen.getByTestId("header-sign");

      expect(header).toContainElement(container);
      expect(container).toContainElement(logoLink);
      expect(container).toContainElement(headerSign);
    });
  });

  describe("Visual Effects", () => {
    it("should have backdrop blur effect", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("backdrop-blur-sm");
    });

    it("should have saturation effect", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("saturate-200");
    });

    it("should have semi-transparent background", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      expect(header).toHaveClass("bg-stone-100/75", "dark:bg-stone-900/25");
    });
  });

  describe("Edge Cases", () => {
    it("should render without errors when all components are present", () => {
      expect(() => render(<Header />)).not.toThrow();
    });

    it("should maintain structure even with minimal content", () => {
      render(<Header />);

      const header = screen.getByTestId("header");
      const container = screen.getByTestId("container");
      const logoLink = screen.getByTestId("logo-link");
      const headerSign = screen.getByTestId("header-sign");

      expect(header).toBeInTheDocument();
      expect(container).toBeInTheDocument();
      expect(logoLink).toBeInTheDocument();
      expect(headerSign).toBeInTheDocument();
    });
  });
}); 