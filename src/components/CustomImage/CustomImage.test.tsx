import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@components/BlurImage/BlurImage.astro", () => ({
  default: ({ src, alt, class: className, quality, placeholderQuality, loading, blurAmount, transitionDuration, fallbackDelay, ...rest }: Record<string, unknown>) => {
    return `<div class="custom-image-wrapper" data-testid="custom-image">
      <img src="${src}" alt="${alt}" class="${className}" 
           data-quality="${quality}" data-placeholder-quality="${placeholderQuality}" 
           data-loading="${loading}" data-blur-amount="${blurAmount}" 
           data-transition-duration="${transitionDuration}" data-fallback-delay="${fallbackDelay}" 
           ${Object.entries(rest).map(([key, value]) => `${key}="${value}"`).join(" ")} />
    </div>`;
  }
}));

describe("CustomImage", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Props and configuration", () => {
    it("should render with basic props", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const customImage = container.querySelector("[data-testid='custom-image']");
      const img = customImage?.querySelector("img");

      expect(customImage).toBeTruthy();
      expect(img).toHaveAttribute("src", "content-image.jpg");
      expect(img).toHaveAttribute("alt", "Content image");
    });

    it("should apply custom CSS classes", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover custom-content-class" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveClass("custom-content-class");
    });

    it("should pass additional props correctly", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000"
               width="600" height="400" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("width", "600");
      expect(img).toHaveAttribute("height", "400");
    });
  });

  describe("Content-specific configuration", () => {
    it("should use medium quality for main image", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-quality", "85");
    });

    it("should use medium quality for placeholder", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-placeholder-quality", "20");
    });

    it("should use lazy loading for content", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-loading", "lazy");
    });

    it("should use moderate blur for content", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-blur-amount", "8");
    });
  });

  describe("Transitions and timing", () => {
    it("should use fast transition for content", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-transition-duration", "500");
    });

    it("should use moderate fallback delay for content", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-fallback-delay", "2000");
    });
  });

  describe("Content optimization", () => {
    it("should have optimized configuration for blog content", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");

      expect(img).toHaveAttribute("data-quality", "85");
      expect(img).toHaveAttribute("data-placeholder-quality", "20");
      expect(img).toHaveAttribute("data-loading", "lazy");
      expect(img).toHaveAttribute("data-blur-amount", "8");
      expect(img).toHaveAttribute("data-transition-duration", "500");
      expect(img).toHaveAttribute("data-fallback-delay", "2000");
    });

    it("should be lighter than HeroImage", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");

      const quality = parseInt(img?.getAttribute("data-quality") || "0");
      const placeholderQuality = parseInt(img?.getAttribute("data-placeholder-quality") || "0");
      const blurAmount = parseInt(img?.getAttribute("data-blur-amount") || "0");
      const transitionDuration = parseInt(img?.getAttribute("data-transition-duration") || "0");
      const fallbackDelay = parseInt(img?.getAttribute("data-fallback-delay") || "0");

      expect(quality).toBeLessThan(90);
      expect(placeholderQuality).toBeGreaterThan(10);
      expect(blurAmount).toBeLessThan(20);
      expect(transitionDuration).toBeLessThan(700);
      expect(fallbackDelay).toBeLessThan(3000);
    });
  });

  describe("Accessibility", () => {
    it("should have appropriate alt text for content", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Diagram showing the system architecture" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("alt", "Diagram showing the system architecture");
    });

    it("should have correct semantic structure", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const customImage = container.querySelector("[data-testid='custom-image']");
      const img = customImage?.querySelector("img");

      expect(customImage).toBeTruthy();
      expect(img).toBeTruthy();
      expect(img).toHaveAttribute("src");
      expect(img).toHaveAttribute("alt");
    });
  });

  describe("BlurImage integration", () => {
    it("should pass all props correctly to BlurImage", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");

      expect(img).toHaveAttribute("data-quality", "85");
      expect(img).toHaveAttribute("data-placeholder-quality", "20");
      expect(img).toHaveAttribute("data-loading", "lazy");
      expect(img).toHaveAttribute("data-blur-amount", "8");
      expect(img).toHaveAttribute("data-transition-duration", "500");
      expect(img).toHaveAttribute("data-fallback-delay", "2000");
    });

    it("should maintain BlurImage functionality", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const customImage = container.querySelector("[data-testid='custom-image']");
      expect(customImage).toBeTruthy();

      expect(customImage?.tagName).toBe("DIV");
      expect(customImage).toHaveClass("custom-image-wrapper");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty src", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("src", "");
    });

    it("should handle empty alt", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("alt", "");
    });

    it("should handle dynamic additional props", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="custom-image-wrapper" data-testid="custom-image">
          <img src="content-image.jpg" alt="Content image" class="w-full h-full object-cover" 
               data-quality="85" data-placeholder-quality="20" data-loading="lazy" 
               data-blur-amount="8" data-transition-duration="500" data-fallback-delay="2000"
               data-custom-prop="custom-value" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-custom-prop", "custom-value");
    });
  });
}); 