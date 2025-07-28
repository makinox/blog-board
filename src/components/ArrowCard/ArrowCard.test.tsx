import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArrowCard } from "./ArrowCard";

describe("ArrowCard", () => {
  it("should render with correct title and slug", () => {
    const title = "Test Post Title";
    const slug = "test-post-slug";

    render(<ArrowCard title={title} slug={slug} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/test-post-slug");
  });

  it("should render with different title and slug", () => {
    const title = "Another Post";
    const slug = "another-post";

    render(<ArrowCard title={title} slug={slug} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/another-post");
  });

  it("should render with empty title and slug", () => {
    const title = "";
    const slug = "";

    render(<ArrowCard title={title} slug={slug} />);

    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/");
  });

  it("should render with special characters in title and slug", () => {
    const title = "Post with special chars: @#$%^&*()";
    const slug = "post-with-special-chars";

    render(<ArrowCard title={title} slug={slug} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/post-with-special-chars");
  });

  it("should render with long title", () => {
    const title = "This is a very long title that should be displayed properly in the ArrowCard component";
    const slug = "long-title-post";

    render(<ArrowCard title={title} slug={slug} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/long-title-post");
  });

  it("should render with numbers in slug", () => {
    const title = "Post 123";
    const slug = "post-123";

    render(<ArrowCard title={title} slug={slug} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/post-123");
  });

  it("should have correct CSS classes", () => {
    const title = "Test Post";
    const slug = "test-post";

    render(<ArrowCard title={title} slug={slug} />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass(
      "relative",
      "group",
      "flex",
      "flex-wrap",
      "sm:flex-nowrap",
      "py-2",
      "sm:py-3",
      "px-3",
      "sm:px-4",
      "pr-8",
      "sm:pr-10",
      "rounded-lg",
      "border",
      "border-black/15",
      "dark:border-white/20",
      "hover:bg-black/5",
      "dark:hover:bg-white/5",
      "hover:text-black",
      "dark:hover:text-white",
      "transition-colors",
      "duration-300",
      "ease-in-out"
    );
  });

  it("should have correct structure with title container", () => {
    const title = "Test Post";
    const slug = "test-post";

    render(<ArrowCard title={title} slug={slug} />);

    const link = screen.getByRole("link");
    const titleContainer = link.querySelector("div");
    const titleElement = titleContainer?.querySelector("div");

    expect(titleContainer).toHaveClass("flex", "flex-col", "flex-1", "min-w-0");
    expect(titleElement).toHaveClass("font-semibold", "text-sm", "sm:text-base", "line-clamp-1");
  });

  it("should contain SVG arrow icon", () => {
    const title = "Test Post";
    const slug = "test-post";

    render(<ArrowCard title={title} slug={slug} />);

    const link = screen.getByRole("link");
    const svg = link.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveClass(
      "absolute",
      "top-1/2",
      "right-2",
      "-translate-y-1/2",
      "size-4",
      "sm:size-5",
      "stroke-2",
      "fill-none",
      "stroke-current"
    );
  });

  it("should contain SVG line and polyline elements", () => {
    const title = "Test Post";
    const slug = "test-post";

    render(<ArrowCard title={title} slug={slug} />);

    const link = screen.getByRole("link");
    const svg = link.querySelector("svg");
    const line = svg?.querySelector("line");
    const polyline = svg?.querySelector("polyline");

    expect(line).toBeInTheDocument();
    expect(line).toHaveAttribute("x1", "5");
    expect(line).toHaveAttribute("y1", "12");
    expect(line).toHaveAttribute("x2", "19");
    expect(line).toHaveAttribute("y2", "12");
    expect(line).toHaveClass(
      "translate-x-3",
      "group-hover:translate-x-0",
      "scale-x-0",
      "group-hover:scale-x-100",
      "transition-transform",
      "duration-300",
      "ease-in-out"
    );

    expect(polyline).toBeInTheDocument();
    expect(polyline).toHaveAttribute("points", "12 5 19 12 12 19");
    expect(polyline).toHaveClass(
      "-translate-x-1",
      "group-hover:translate-x-0",
      "transition-transform",
      "duration-300",
      "ease-in-out"
    );
  });

  it("should be accessible with proper role and text", () => {
    const title = "Accessible Post";
    const slug = "accessible-post";

    render(<ArrowCard title={title} slug={slug} />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent(title);
  });

  it("should handle undefined props gracefully", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Testing with undefined props
    render(<ArrowCard title={undefined} slug={undefined} />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/blog/undefined");
  });
}); 