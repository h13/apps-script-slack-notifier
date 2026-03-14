import type { RowEntry } from "../src/sheet-reader.js";
import { buildSlackPayload } from "../src/slack-message.js";

describe("buildSlackPayload", () => {
  it("builds payload for single row", () => {
    const rows: readonly RowEntry[] = [
      { index: 2, data: ["Alice", "alice@example.com"] },
    ];
    const result = buildSlackPayload(rows, "C01234567");
    expect(result).toEqual({
      channel: "C01234567",
      text: expect.stringContaining("Alice"),
    });
  });

  it("builds payload for multiple rows", () => {
    const rows: readonly RowEntry[] = [
      { index: 2, data: ["Alice", "alice@example.com"] },
      { index: 3, data: ["Bob", "bob@example.com"] },
    ];
    const result = buildSlackPayload(rows, "C01234567");
    expect(result.channel).toBe("C01234567");
    expect(result.text).toContain("Alice");
    expect(result.text).toContain("Bob");
    expect(result.text).toContain("2 件");
  });

  it("escapes special characters in data", () => {
    const rows: readonly RowEntry[] = [
      { index: 2, data: ["<script>alert('xss')</script>", "test"] },
    ];
    const result = buildSlackPayload(rows, "C01234567");
    expect(result.text).not.toContain("<script>");
    expect(result.text).toContain("&lt;script&gt;");
  });
});
