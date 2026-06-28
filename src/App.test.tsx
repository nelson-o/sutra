import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

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
  });

  it("removes the old excerpt landing content", () => {
    render(<App />);

    expect(
      screen.queryByText(/selected public-domain Chinese passages/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/About the text/i)).not.toBeInTheDocument();
  });
});
