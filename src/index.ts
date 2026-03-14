import { extractNewRows } from "./sheet-reader.js";
import { buildSlackPayload } from "./slack-message.js";

function checkNewRows(): void {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty("SLACK_BOT_TOKEN");
  const channelId = props.getProperty("SLACK_CHANNEL_ID");

  if (!token || !channelId) {
    throw new Error(
      "Slack config not set. Run setSlackConfig(token, channelId) first.",
    );
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const allRows = sheet.getDataRange().getValues() as string[][];
  const lastProcessed = Number(props.getProperty("LAST_PROCESSED_ROW") ?? "1");

  const newRows = extractNewRows(allRows, lastProcessed);
  if (newRows.length === 0) return;

  const payload = buildSlackPayload(newRows, channelId);

  const response = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const responseBody = JSON.parse(response.getContentText()) as {
    ok: boolean;
    error?: string;
  };
  if (!responseBody.ok) {
    throw new Error(`Slack API error: ${responseBody.error ?? "unknown"}`);
  }

  props.setProperty("LAST_PROCESSED_ROW", String(allRows.length));
}

function setSlackConfig(token: string, channelId: string): void {
  const props = PropertiesService.getScriptProperties();
  props.setProperty("SLACK_BOT_TOKEN", token);
  props.setProperty("SLACK_CHANNEL_ID", channelId);
}
