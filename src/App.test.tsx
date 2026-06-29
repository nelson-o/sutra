import {
  cleanup,
  fireEvent,
  render,
  screen,
  within
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value
  });
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  setScrollY(0);
});

describe("Diamond Sutra Devanagari reader", () => {
  it("renders the heading and defaults to the first marker page", () => {
    render(<App />);

    const reader = screen.getByRole("article", {
      name: /complete diamond sutra in sanskrit/i
    });

    expect(
      screen.getByRole("heading", { level: 1, name: "वज्रच्छेदिका" })
    ).toBeInTheDocument();
    expect(reader).toHaveTextContent("वज्रच्छेदिका नाम त्रिशतिका");
    expect(reader).toHaveTextContent("नमो भगवत्या आर्यप्रज्ञापारमितायै");
    expect(reader).toHaveTextContent("एवं मया श्रुतम्");
    expect(reader).toHaveTextContent("॥१॥");
    expect(reader).not.toHaveTextContent("आश्चर्यं भगवन्");
    expect(within(reader).getByText("॥१॥")).toHaveClass(
      "sutra-text__section"
    );
    expect(
      screen.queryByText("Vajracchedikā Prajñāpāramitā Sūtra")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("◆")).not.toBeInTheDocument();
  });

  it("renders a fixed paginator that moves between marker pages and saves progress", () => {
    render(<App />);

    const reader = screen.getByRole("article", {
      name: /complete diamond sutra in sanskrit/i
    });
    const previous = screen.getByRole("button", { name: /previous marker/i });
    const next = screen.getByRole("button", { name: /next marker/i });

    expect(previous).toHaveTextContent("<");
    expect(next).toHaveTextContent(">");
    expect(previous).toBeDisabled();
    expect(next).not.toBeDisabled();
    expect(screen.getByText("1 / 32")).toBeInTheDocument();

    fireEvent.click(next);

    expect(reader).toHaveTextContent("आश्चर्यं भगवन्");
    expect(reader).toHaveTextContent("॥२॥");
    expect(reader).not.toHaveTextContent("वज्रच्छेदिका नाम त्रिशतिका");
    expect(screen.getByText("2 / 32")).toBeInTheDocument();
    expect(window.localStorage.getItem("sutra:last-marker")).toBe("2");
    expect(previous).not.toBeDisabled();

    fireEvent.click(previous);

    expect(reader).toHaveTextContent("वज्रच्छेदिका नाम त्रिशतिका");
    expect(reader).toHaveTextContent("॥१॥");
    expect(screen.getByText("1 / 32")).toBeInTheDocument();
    expect(window.localStorage.getItem("sutra:last-marker")).toBe("1");
  });

  it("restores a valid saved marker and disables next on the final page", () => {
    window.localStorage.setItem("sutra:last-marker", "32");

    render(<App />);

    const reader = screen.getByRole("article", {
      name: /complete diamond sutra in sanskrit/i
    });

    expect(reader).toHaveTextContent("॥३२॥");
    expect(reader).toHaveTextContent(
      "आर्यवज्रच्छेदिका भगवती प्रज्ञापारमिता समाप्ता"
    );
    expect(screen.getByText("32 / 32")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next marker/i })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /previous marker/i })
    ).not.toBeDisabled();
  });

  it("falls back to the first marker page when saved progress is invalid", () => {
    window.localStorage.setItem("sutra:last-marker", "99");

    render(<App />);

    const reader = screen.getByRole("article", {
      name: /complete diamond sutra in sanskrit/i
    });

    expect(reader).toHaveTextContent("॥१॥");
    expect(reader).not.toHaveTextContent("॥३२॥");
    expect(screen.getByText("1 / 32")).toBeInTheDocument();
  });

  it("keeps every marker reachable through next navigation", () => {
    render(<App />);

    const next = screen.getByRole("button", { name: /next marker/i });

    for (let markerNumber = 2; markerNumber <= 32; markerNumber += 1) {
      fireEvent.click(next);

      expect(screen.getByText(`${markerNumber} / 32`)).toBeInTheDocument();
    }

    expect(next).toBeDisabled();
  });

  it("renders when reading progress storage is unavailable", () => {
    const getItem = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });

    render(<App />);

    const reader = screen.getByRole("article", {
      name: /complete diamond sutra in sanskrit/i
    });

    expect(reader).toHaveTextContent("॥१॥");
    expect(screen.getByText("1 / 32")).toBeInTheDocument();

    getItem.mockRestore();
    setItem.mockRestore();
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
