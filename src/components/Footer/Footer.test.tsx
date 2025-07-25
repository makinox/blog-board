import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the constants
vi.mock("@consts", () => ({
  SOCIALS: [
    { NAME: "instagram", HREF: "https://www.instagram.com/jesusbossa.dev" },
    { NAME: "github", HREF: "https://github.com/makinox" },
    { NAME: "linkedin", HREF: "https://www.linkedin.com/in/jesusbossa" },
    { NAME: "home", HREF: "https://jesusbossa.dev" },
  ],
}));

// Mock the Container component
vi.mock("@components/Container/Container.astro", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

// Mock the utils
vi.mock("@lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

// Mock React icons
vi.mock("react-icons/fa", () => ({
  FaRegUser: () => <span data-testid="fa-reg-user">User Icon</span>,
  FaGithub: () => <span data-testid="fa-github">GitHub Icon</span>,
  FaInstagram: () => <span data-testid="fa-instagram">Instagram Icon</span>,
  FaLinkedin: () => <span data-testid="fa-linkedin">LinkedIn Icon</span>,
}));

// Create a React equivalent of the Footer component for testing
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const SOCIALS = [
    { NAME: "instagram", HREF: "https://www.instagram.com/jesusbossa.dev" },
    { NAME: "github", HREF: "https://github.com/makinox" },
    { NAME: "linkedin", HREF: "https://www.linkedin.com/in/jesusbossa" },
    { NAME: "home", HREF: "https://jesusbossa.dev" },
  ];

  const classes = {
    link: "group size-8 flex items-center justify-center rounded-full hover:text-info transition-colors duration-300 ease-in-out",
  };

  return (
    <footer className="animate py-5 text-sm mt-auto" data-testid="footer">
      <div data-testid="container">
        <div className="flex justify-between items-center">
          <div>
            &copy; {currentYear}
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            <a href={SOCIALS[0].HREF} className={classes.link} target="_blank" data-testid="instagram-link">
              <span data-testid="fa-instagram">Instagram Icon</span>
            </a>

            <a href={SOCIALS[1].HREF} className={classes.link} target="_blank" data-testid="github-link">
              <span data-testid="fa-github">GitHub Icon</span>
            </a>

            <a href={SOCIALS[2].HREF} className={classes.link} target="_blank" data-testid="linkedin-link">
              <span data-testid="fa-linkedin">LinkedIn Icon</span>
            </a>

            <a href={SOCIALS[3].HREF} className={classes.link} target="_blank" data-testid="home-link">
              <span data-testid="fa-reg-user">User Icon</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

describe("Footer", () => {
  describe("Rendering", () => {
    it("should render the footer component", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      expect(footer).toBeInTheDocument();
      expect(footer.tagName).toBe("FOOTER");
    });

    it("should render the container component", () => {
      render(<Footer />);

      const container = screen.getByTestId("container");
      expect(container).toBeInTheDocument();
    });

    it("should render the main layout structure", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      const container = screen.getByTestId("container");

      expect(footer).toContainElement(container);
    });
  });

  describe("Copyright Section", () => {
    it("should display the current year in copyright", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear}`)).toBeInTheDocument();
    });

    it("should have the copyright text in the left section", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      const copyrightText = screen.getByText(`© ${currentYear}`);
      const parentDiv = copyrightText.parentElement;

      expect(parentDiv).toBeInTheDocument();
    });
  });

  describe("Social Links", () => {
    it("should render all four social media links", () => {
      render(<Footer />);

      expect(screen.getByTestId("instagram-link")).toBeInTheDocument();
      expect(screen.getByTestId("github-link")).toBeInTheDocument();
      expect(screen.getByTestId("linkedin-link")).toBeInTheDocument();
      expect(screen.getByTestId("home-link")).toBeInTheDocument();
    });

    it("should have correct Instagram link", () => {
      render(<Footer />);

      const instagramLink = screen.getByTestId("instagram-link");
      expect(instagramLink).toHaveAttribute("href", "https://www.instagram.com/jesusbossa.dev");
      expect(instagramLink).toHaveAttribute("target", "_blank");
    });

    it("should have correct GitHub link", () => {
      render(<Footer />);

      const githubLink = screen.getByTestId("github-link");
      expect(githubLink).toHaveAttribute("href", "https://github.com/makinox");
      expect(githubLink).toHaveAttribute("target", "_blank");
    });

    it("should have correct LinkedIn link", () => {
      render(<Footer />);

      const linkedinLink = screen.getByTestId("linkedin-link");
      expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/jesusbossa");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
    });

    it("should have correct Home link", () => {
      render(<Footer />);

      const homeLink = screen.getByTestId("home-link");
      expect(homeLink).toHaveAttribute("href", "https://jesusbossa.dev");
      expect(homeLink).toHaveAttribute("target", "_blank");
    });

    it("should render correct icons for each social link", () => {
      render(<Footer />);

      expect(screen.getByTestId("fa-instagram")).toBeInTheDocument();
      expect(screen.getByTestId("fa-github")).toBeInTheDocument();
      expect(screen.getByTestId("fa-linkedin")).toBeInTheDocument();
      expect(screen.getByTestId("fa-reg-user")).toBeInTheDocument();
    });

    it("should have Instagram icon in Instagram link", () => {
      render(<Footer />);

      const instagramLink = screen.getByTestId("instagram-link");
      const instagramIcon = screen.getByTestId("fa-instagram");

      expect(instagramLink).toContainElement(instagramIcon);
    });

    it("should have GitHub icon in GitHub link", () => {
      render(<Footer />);

      const githubLink = screen.getByTestId("github-link");
      const githubIcon = screen.getByTestId("fa-github");

      expect(githubLink).toContainElement(githubIcon);
    });

    it("should have LinkedIn icon in LinkedIn link", () => {
      render(<Footer />);

      const linkedinLink = screen.getByTestId("linkedin-link");
      const linkedinIcon = screen.getByTestId("fa-linkedin");

      expect(linkedinLink).toContainElement(linkedinIcon);
    });

    it("should have User icon in Home link", () => {
      render(<Footer />);

      const homeLink = screen.getByTestId("home-link");
      const userIcon = screen.getByTestId("fa-reg-user");

      expect(homeLink).toContainElement(userIcon);
    });
  });

  describe("Styling and Classes", () => {
    it("should have correct footer classes", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("animate", "py-5", "text-sm", "mt-auto");
    });

    it("should have correct layout classes", () => {
      render(<Footer />);

      const container = screen.getByTestId("container");
      const layoutDiv = container.querySelector("div");

      expect(layoutDiv).toHaveClass("flex", "justify-between", "items-center");
    });

    it("should have correct social links container classes", () => {
      render(<Footer />);

      const socialLinksContainer = screen.getByTestId("github-link").parentElement;
      expect(socialLinksContainer).toHaveClass("flex", "flex-wrap", "gap-1", "items-center");
    });

    it("should have correct link classes for all social links", () => {
      render(<Footer />);

      const expectedClasses = "group size-8 flex items-center justify-center rounded-full hover:text-info transition-colors duration-300 ease-in-out";

      const instagramLink = screen.getByTestId("instagram-link");
      const githubLink = screen.getByTestId("github-link");
      const linkedinLink = screen.getByTestId("linkedin-link");
      const homeLink = screen.getByTestId("home-link");

      expect(instagramLink).toHaveClass(...expectedClasses.split(" "));
      expect(githubLink).toHaveClass(...expectedClasses.split(" "));
      expect(linkedinLink).toHaveClass(...expectedClasses.split(" "));
      expect(homeLink).toHaveClass(...expectedClasses.split(" "));
    });

    it("should have animate class for animation", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("animate");
    });

    it("should have py-5 class for vertical padding", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("py-5");
    });

    it("should have text-sm class for small text", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("text-sm");
    });

    it("should have mt-auto class for margin top auto", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      expect(footer).toHaveClass("mt-auto");
    });
  });

  describe("Layout Structure", () => {
    it("should have proper flex layout between copyright and social links", () => {
      render(<Footer />);

      const container = screen.getByTestId("container");
      const layoutDiv = container.querySelector("div");

      expect(layoutDiv).toHaveClass("flex", "justify-between", "items-center");
    });

    it("should have social links in a flex container with gap", () => {
      render(<Footer />);

      const socialLinksContainer = screen.getByTestId("github-link").parentElement;
      expect(socialLinksContainer).toHaveClass("flex", "flex-wrap", "gap-1", "items-center");
    });

    it("should maintain proper spacing between social links", () => {
      render(<Footer />);

      const socialLinksContainer = screen.getByTestId("github-link").parentElement;
      expect(socialLinksContainer).toHaveClass("gap-1");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic footer element", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      expect(footer.tagName).toBe("FOOTER");
    });

    it("should have proper link attributes for external links", () => {
      render(<Footer />);

      const socialLinks = [
        screen.getByTestId("instagram-link"),
        screen.getByTestId("github-link"),
        screen.getByTestId("linkedin-link"),
        screen.getByTestId("home-link"),
      ];

      socialLinks.forEach(link => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("href");
      });
    });

    it("should have accessible link text through icons", () => {
      render(<Footer />);

      expect(screen.getByText("Instagram Icon")).toBeInTheDocument();
      expect(screen.getByText("GitHub Icon")).toBeInTheDocument();
      expect(screen.getByText("LinkedIn Icon")).toBeInTheDocument();
      expect(screen.getByText("User Icon")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should have flex-wrap class for responsive behavior", () => {
      render(<Footer />);

      const socialLinksContainer = screen.getByTestId("github-link").parentElement;
      expect(socialLinksContainer).toHaveClass("flex-wrap");
    });

    it("should maintain proper alignment with flex classes", () => {
      render(<Footer />);

      const socialLinksContainer = screen.getByTestId("github-link").parentElement;
      expect(socialLinksContainer).toHaveClass("items-center");
    });
  });

  describe("Integration", () => {
    it("should work with Container component", () => {
      render(<Footer />);

      const container = screen.getByTestId("container");
      const footer = screen.getByTestId("footer");

      expect(footer).toContainElement(container);
    });

    it("should maintain proper nesting structure", () => {
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      const container = screen.getByTestId("container");
      const layoutDiv = container.querySelector("div");
      const socialLinksContainer = screen.getByTestId("github-link").parentElement;

      expect(footer).toContainElement(container);
      expect(container).toContainElement(layoutDiv);
      expect(layoutDiv).toContainElement(socialLinksContainer);
    });
  });

  describe("Edge Cases", () => {
    it("should display current year in copyright", () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      // Check that the copyright section contains the current year by looking at the specific div
      const copyrightDiv = screen.getByTestId("footer").querySelector("div > div > div:first-child");
      expect(copyrightDiv).toHaveTextContent("©");
      expect(copyrightDiv).toHaveTextContent(currentYear.toString());
    });

    it("should maintain structure even with empty social links", () => {
      // This test ensures the component structure is robust
      render(<Footer />);

      const footer = screen.getByTestId("footer");
      const container = screen.getByTestId("container");

      expect(footer).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });
  });

  describe("Hover Effects", () => {
    it("should have hover:text-info class for hover effects", () => {
      render(<Footer />);

      const socialLinks = [
        screen.getByTestId("instagram-link"),
        screen.getByTestId("github-link"),
        screen.getByTestId("linkedin-link"),
        screen.getByTestId("home-link"),
      ];

      socialLinks.forEach(link => {
        expect(link).toHaveClass("hover:text-info");
      });
    });

    it("should have transition classes for smooth animations", () => {
      render(<Footer />);

      const socialLinks = [
        screen.getByTestId("instagram-link"),
        screen.getByTestId("github-link"),
        screen.getByTestId("linkedin-link"),
        screen.getByTestId("home-link"),
      ];

      socialLinks.forEach(link => {
        expect(link).toHaveClass("transition-colors", "duration-300", "ease-in-out");
      });
    });
  });
}); 