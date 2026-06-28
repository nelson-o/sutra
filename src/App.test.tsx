import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value
  });
}

afterEach(() => {
  cleanup();
  setScrollY(0);
});

describe("Diamond Sutra Devanagari reader", () => {
  it("renders the compact heading and complete sutra boundaries", () => {
    render(<App />);

    const reader = screen.getByRole("article", {
      name: /complete diamond sutra in sanskrit/i
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "वज्रच्छेदिका" })
    ).toBeInTheDocument();
    expect(reader).toHaveTextContent("एवं मया श्रुतम्");
    expect(reader).toHaveTextContent("॥३२॥");
    expect(reader).toHaveTextContent(
      "आर्यवज्रच्छेदिका भगवती प्रज्ञापारमिता समाप्ता"
    );
    expect(screen.getByText("॥३२॥")).toHaveClass("sutra-text__section");
    expect(
      screen.queryByText("Vajracchedikā Prajñāpāramitā Sūtra")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("◆")).not.toBeInTheDocument();
  });

  it("fixes a smaller heading after a slight scroll and restores it at top", () => {
    setScrollY(0);
    const { container } = render(<App />);
    const masthead = container.querySelector(".masthead");

    expect(masthead).not.toHaveClass("masthead--compact");

    setScrollY(17);
    fireEvent.scroll(window);
    expect(masthead).toHaveClass("masthead--compact");

    setScrollY(0);
    fireEvent.scroll(window);
    expect(masthead).not.toHaveClass("masthead--compact");
  });

  it("removes the old excerpt landing content", () => {
    render(<App />);

    expect(
      screen.queryByText(/selected public-domain Chinese passages/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/About the text/i)).not.toBeInTheDocument();
  });
});
