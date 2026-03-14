import { extractNewRows } from "../src/sheet-reader.js";

describe("extractNewRows", () => {
  it("returns empty array when no new rows", () => {
    const allRows = [
      ["Name", "Email"],
      ["Alice", "alice@example.com"],
    ];
    const result = extractNewRows(allRows, 2);
    expect(result).toEqual([]);
  });

  it("returns new rows after lastProcessedIndex", () => {
    const allRows = [
      ["Name", "Email"],
      ["Alice", "alice@example.com"],
      ["Bob", "bob@example.com"],
    ];
    const result = extractNewRows(allRows, 1);
    expect(result).toEqual([
      { index: 2, data: ["Alice", "alice@example.com"] },
      { index: 3, data: ["Bob", "bob@example.com"] },
    ]);
  });

  it("returns all data rows when lastProcessedIndex is 0", () => {
    const allRows = [
      ["Name", "Email"],
      ["Alice", "alice@example.com"],
    ];
    const result = extractNewRows(allRows, 0);
    expect(result).toEqual([
      { index: 1, data: ["Name", "Email"] },
      { index: 2, data: ["Alice", "alice@example.com"] },
    ]);
  });

  it("returns empty array for empty sheet", () => {
    const result = extractNewRows([], 0);
    expect(result).toEqual([]);
  });

  it("returns empty array when lastProcessedIndex equals row count", () => {
    const allRows = [["Name", "Email"]];
    const result = extractNewRows(allRows, 1);
    expect(result).toEqual([]);
  });
});
