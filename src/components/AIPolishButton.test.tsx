import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import AIPolishButton from "./AIPolishButton";

describe("AIPolishButton", () => {
  let onUpdate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onUpdate = vi.fn();
    vi.restoreAllMocks();
  });

  it("renders all four action buttons", () => {
    render(
      <AIPolishButton currentText="Some text" onUpdate={onUpdate} />
    );
    expect(screen.getByText("Professionalize")).toBeInTheDocument();
    expect(screen.getByText("Shorten")).toBeInTheDocument();
    expect(screen.getByText("Bullet points")).toBeInTheDocument();
    expect(screen.getByText("Expand")).toBeInTheDocument();
  });

  it("renders the AI rewrite label", () => {
    render(
      <AIPolishButton currentText="Some text" onUpdate={onUpdate} />
    );
    expect(screen.getByText("AI rewrite:")).toBeInTheDocument();
  });

  it("does nothing when currentText is empty", () => {
    render(<AIPolishButton currentText="" onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Professionalize"));
    expect(global.fetch).toBeUndefined;
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("does nothing when currentText is only whitespace", () => {
    render(<AIPolishButton currentText="   " onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Shorten"));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("sends correct command for professionalize", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, enhancedText: "Enhanced text" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(
      <AIPolishButton
        currentText="Original text"
        onUpdate={onUpdate}
        fieldName="Summary"
      />
    );

    fireEvent.click(screen.getByText("Professionalize"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/edit-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Original text",
          command: "professionalize",
          fieldName: "Summary",
        }),
      });
    });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith("Enhanced text");
    });
  });

  it("sends correct command for shorten", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, enhancedText: "Short text" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(
      <AIPolishButton currentText="Long text here" onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText("Shorten"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/edit-content",
        expect.objectContaining({
          body: expect.stringContaining('"command":"shorten"'),
        })
      );
    });
  });

  it("sends correct command for bullet-points", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, enhancedText: "- Point 1\n- Point 2" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(
      <AIPolishButton currentText="A paragraph" onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText("Bullet points"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/edit-content",
        expect.objectContaining({
          body: expect.stringContaining('"command":"bullet-points"'),
        })
      );
    });
  });

  it("sends correct command for expand", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, enhancedText: "Expanded version" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(
      <AIPolishButton currentText="Brief text" onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText("Expand"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/edit-content",
        expect.objectContaining({
          body: expect.stringContaining('"command":"expand"'),
        })
      );
    });
  });

  it("shows loading state during API call", async () => {
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                new Response(
                  JSON.stringify({ success: true, enhancedText: "Done" }),
                  {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  }
                )
              ),
            200
          )
        )
    );

    render(
      <AIPolishButton currentText="Test text" onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText("Professionalize"));

    await waitFor(() => {
      expect(screen.getByText("Polishing...")).toBeInTheDocument();
    });
  });

  it("shows error message when API returns failure", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "API quota exceeded" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(
      <AIPolishButton currentText="Some text" onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText("Professionalize"));

    await waitFor(() => {
      expect(screen.getByText("API quota exceeded")).toBeInTheDocument();
    });
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("shows generic error on network failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    render(
      <AIPolishButton currentText="Some text" onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText("Professionalize"));

    await waitFor(() => {
      expect(screen.getByText("Server error.")).toBeInTheDocument();
    });
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("shows fallback error when API response has no error message", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    render(
      <AIPolishButton currentText="Some text" onUpdate={onUpdate} />
    );

    fireEvent.click(screen.getByText("Shorten"));

    await waitFor(() => {
      expect(screen.getByText("Enhancement failed.")).toBeInTheDocument();
    });
  });
});
