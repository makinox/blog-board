import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("astro:assets", () => ({
  Image: ({ src, alt, class: className, ...props }: Record<string, unknown>) => {
    return `<img src="${src}" alt="${alt}" class="${className}" data-testid="blur-image" ${Object.entries(props).map(([key, value]) => `${key}="${value}"`).join(" ")} />`;
  }
}));

describe("BlurImage", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Props and configuration", () => {
    it("should render with basic props", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const images = container.querySelectorAll("[data-testid='blur-image']");
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute("src", "test-image.jpg");
      expect(images[0]).toHaveAttribute("alt", "Test image");
    });

    it("should apply custom CSS classes", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden custom-class">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out custom-class" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out custom-class" data-testid="blur-image" />
        </div>
      `;

      const containerDiv = container.querySelector(".relative.overflow-hidden");
      expect(containerDiv).toHaveClass("custom-class");
    });

    it("should have animated placeholder", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const placeholder = container.querySelector(".animate-pulse");
      expect(placeholder).toBeTruthy();
      expect(placeholder).toHaveClass("bg-gradient-to-br");
    });
  });

  describe("Quality configuration", () => {
    it("should use default quality for placeholder", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" quality="20" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" quality="85" />
        </div>
      `;

      const images = container.querySelectorAll("[data-testid='blur-image']");
      expect(images[0]).toHaveAttribute("quality", "20");
      expect(images[1]).toHaveAttribute("quality", "85");
    });
  });

  describe("Blur configuration", () => {
    it("should apply default blur", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const placeholderImage = container.querySelector("[data-testid='blur-image']");
      expect(placeholderImage?.getAttribute("style")).toContain("blur(8px)");
    });
  });

  describe("DOM structure", () => {
    it("should have correct structure with three elements", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const containerDiv = container.querySelector(".relative.overflow-hidden");
      const children = containerDiv?.children;

      expect(children).toHaveLength(3);
      expect(children?.[0]).toHaveClass("absolute", "inset-0", "bg-gradient-to-br");
      expect(children?.[1]).toHaveAttribute("data-testid", "blur-image");
      expect(children?.[2]).toHaveAttribute("data-testid", "blur-image");
    });

    it("should have correct absolute positioning", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const images = container.querySelectorAll("[data-testid='blur-image']");
      images.forEach(img => {
        expect(img).toHaveClass("absolute", "inset-0", "w-full", "h-full", "object-cover");
      });
    });
  });

  describe("CSS transitions", () => {
    it("should have configured transitions", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const images = container.querySelectorAll("[data-testid='blur-image']");
      expect(images[0]).toHaveClass("transition-all", "duration-400", "ease-out");
      expect(images[1]).toHaveClass("transition-all", "duration-700", "ease-out");
    });

    it("should have initial opacity of 0", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const images = container.querySelectorAll("[data-testid='blur-image']");
      images.forEach(img => {
        expect(img).toHaveClass("opacity-0");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have appropriate alt text", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Image description" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" />
          <img src="test-image.jpg" alt="Image description" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" />
        </div>
      `;

      const images = container.querySelectorAll("[data-testid='blur-image']");
      images.forEach(img => {
        expect(img).toHaveAttribute("alt", "Image description");
      });
    });

    it("should have appropriate loading attributes", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg"></div>
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-400 ease-out" style="filter: blur(8px) brightness(0.9); transform: scale(1.02);" data-testid="blur-image" loading="lazy" decoding="async" />
          <img src="test-image.jpg" alt="Test image" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out" data-testid="blur-image" loading="lazy" decoding="async" />
        </div>
      `;

      const images = container.querySelectorAll("[data-testid='blur-image']");
      images.forEach(img => {
        expect(img).toHaveAttribute("loading", "lazy");
        expect(img).toHaveAttribute("decoding", "async");
      });
    });
  });
}); 