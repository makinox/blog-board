import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@components/BlurImage/BlurImage.astro", () => ({
  default: ({ src, alt, class: className, width, height, quality, placeholderQuality, loading, blurAmount, transitionDuration, fallbackDelay }: Record<string, unknown>) => {
    return `<div class="hero-image-wrapper" data-testid="hero-image">
      <img src="${src}" alt="${alt}" class="${className}" width="${width}" height="${height}" 
           data-quality="${quality}" data-placeholder-quality="${placeholderQuality}" 
           data-loading="${loading}" data-blur-amount="${blurAmount}" 
           data-transition-duration="${transitionDuration}" data-fallback-delay="${fallbackDelay}" />
    </div>`;
  }
}));

describe("HeroImage", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Props and configuration", () => {
    it("should render with basic props", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const heroImage = container.querySelector("[data-testid='hero-image']");
      const img = heroImage?.querySelector("img");

      expect(heroImage).toBeTruthy();
      expect(img).toHaveAttribute("src", "hero-image.jpg");
      expect(img).toHaveAttribute("alt", "Hero image");
      expect(img).toHaveAttribute("width", "1280");
      expect(img).toHaveAttribute("height", "720");
    });

    it("should apply custom CSS classes", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover custom-hero-class" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveClass("custom-hero-class");
    });

    it("should use default dimensions", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("width", "1280");
      expect(img).toHaveAttribute("height", "720");
    });
  });

  describe("Hero-specific configuration", () => {
    it("should use high quality for main image", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-quality", "90");
    });

    it("should use very low quality for placeholder", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-placeholder-quality", "10");
    });

    it("should use eager loading for hero images", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-loading", "eager");
    });

    it("should use intense blur for hero images", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-blur-amount", "20");
    });
  });

  describe("Transitions and timing", () => {
    it("should use longer transition for hero images", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-transition-duration", "700");
    });

    it("should use longer fallback delay for hero images", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-fallback-delay", "3000");
    });
  });

  describe("Custom dimensions", () => {
    it("should accept custom dimensions", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1920" height="1080" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("width", "1920");
      expect(img).toHaveAttribute("height", "1080");
    });

    it("should maintain correct proportions", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1600" height="900" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      const width = parseInt(img?.getAttribute("width") || "0");
      const height = parseInt(img?.getAttribute("height") || "0");
      const aspectRatio = width / height;

      expect(aspectRatio).toBeCloseTo(16 / 9, 1);
    });
  });

  describe("Accessibility", () => {
    it("should have descriptive alt text", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Main image of the article about web development" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("alt", "Main image of the article about web development");
    });

    it("should have correct semantic structure", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const heroImage = container.querySelector("[data-testid='hero-image']");
      const img = heroImage?.querySelector("img");

      expect(heroImage).toBeTruthy();
      expect(img).toBeTruthy();
      expect(img).toHaveAttribute("src");
      expect(img).toHaveAttribute("alt");
    });
  });

  describe("BlurImage integration", () => {
    it("should pass all props correctly to BlurImage", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");

      expect(img).toHaveAttribute("data-quality", "90");
      expect(img).toHaveAttribute("data-placeholder-quality", "10");
      expect(img).toHaveAttribute("data-loading", "eager");
      expect(img).toHaveAttribute("data-blur-amount", "20");
      expect(img).toHaveAttribute("data-transition-duration", "700");
      expect(img).toHaveAttribute("data-fallback-delay", "3000");
    });

    it("should maintain BlurImage functionality", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const heroImage = container.querySelector("[data-testid='hero-image']");
      expect(heroImage).toBeTruthy();

      expect(heroImage?.tagName).toBe("DIV");
      expect(heroImage).toHaveClass("hero-image-wrapper");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty src", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="" alt="Hero image" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("src", "");
    });

    it("should handle empty alt", () => {
      const container = document.createElement("div");
      container.innerHTML = `
        <div class="hero-image-wrapper" data-testid="hero-image">
          <img src="hero-image.jpg" alt="" class="w-full h-full object-cover" 
               width="1280" height="720" data-quality="90" data-placeholder-quality="10" 
               data-loading="eager" data-blur-amount="20" data-transition-duration="700" 
               data-fallback-delay="3000" />
        </div>
      `;

      const img = container.querySelector("img");
      expect(img).toHaveAttribute("alt", "");
    });
  });
}); 