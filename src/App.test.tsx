import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Diamond Sutra landing page", () => {
  it("presents a readable sutra-first landing page", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /diamond sutra/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/selected public-domain Chinese passages/i)).toBeInTheDocument();
    expect(screen.getByText(/一切有為法/)).toBeInTheDocument();
    expect(screen.getByText(/About the text/i)).toBeInTheDocument();
    expect(screen.getByText(/Reading focus/i)).toBeInTheDocument();
    expect(screen.getByText(/No network requests/i)).toBeInTheDocument();
  });
});
