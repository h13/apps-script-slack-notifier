import type { RowEntry } from "./sheet-reader.js";

export interface SlackPayload {
  readonly channel: string;
  readonly text: string;
}

function escapeSlackText(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatRow(row: RowEntry): string {
  const escaped = row.data.map(escapeSlackText);
  return `  Row ${row.index}: ${escaped.join(" | ")}`;
}

export function buildSlackPayload(
  rows: readonly RowEntry[],
  channelId: string,
): SlackPayload {
  const header =
    rows.length === 1
      ? "Spreadsheet に新しい行が追加されました:"
      : `Spreadsheet に ${rows.length} 件の新しい行が追加されました:`;

  const body = rows.map(formatRow).join("\n");

  return {
    channel: channelId,
    text: `${header}\n${body}`,
  };
}
