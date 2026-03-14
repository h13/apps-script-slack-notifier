export interface RowEntry {
  readonly index: number;
  readonly data: readonly string[];
}

export function extractNewRows(
  allRows: readonly (readonly string[])[],
  lastProcessedIndex: number,
): readonly RowEntry[] {
  return allRows.slice(lastProcessedIndex).map((data, i) => ({
    index: lastProcessedIndex + i + 1,
    data,
  }));
}
