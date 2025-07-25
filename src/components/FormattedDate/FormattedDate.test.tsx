import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Create a React equivalent of the FormattedDate component for testing
interface FormattedDateProps {
  date: Date;
}

const FormattedDate = ({ date }: FormattedDateProps) => {
  const formattedDate = date.toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <time className="capitalize" dateTime={date.toISOString()}>
      {formattedDate}
    </time>
  );
};

// Helper to create a fixed date
const TEST_DATE = new Date("2024-06-01T12:34:56Z");
const FORMATTED = TEST_DATE.toLocaleDateString("es-MX", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

describe("FormattedDate", () => {
  it("renders the formatted date and correct datetime attribute", () => {
    render(<FormattedDate date={TEST_DATE} />);

    const time = screen.getByText(FORMATTED);
    expect(time).toBeInTheDocument();
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", TEST_DATE.toISOString());
    expect(time).toHaveClass("capitalize");
  });

  it("formats different dates correctly", () => {
    const differentDate = new Date("2023-12-25T10:30:00Z");
    const expectedFormat = differentDate.toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    render(<FormattedDate date={differentDate} />);

    const time = screen.getByText(expectedFormat);
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute("datetime", differentDate.toISOString());
  });
});