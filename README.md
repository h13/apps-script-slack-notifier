# apps-script-slack-notifier

[![CI](https://github.com/h13/apps-script-slack-notifier/actions/workflows/ci.yml/badge.svg)](https://github.com/h13/apps-script-slack-notifier/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/h13/apps-script-slack-notifier/blob/main/LICENSE)
[![Node.js >=24](https://img.shields.io/badge/Node.js-%3E%3D24-brightgreen.svg)](https://nodejs.org/)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4.svg?logo=google&logoColor=white)](https://script.google.com/)

[日本語](README.ja.md)

Detects new rows added to a Google Spreadsheet and sends Slack notifications via Bot Token using `chat.postMessage` — built from the [apps-script-fleet](https://github.com/h13/apps-script-fleet) template.

## How It Works

1. **Time-driven trigger** — A Google Apps Script time trigger runs `checkNewRows` on a schedule (e.g., every 5 minutes)
2. **New row detection** — Reads all rows from the spreadsheet and extracts rows added after the last processed row index (`LAST_PROCESSED_ROW`)
3. **Slack notification** — Calls `https://slack.com/api/chat.postMessage` via `UrlFetchApp.fetch` with the new row content
4. **State update** — Saves the last processed row index to `PropertiesService` to prevent duplicate notifications on the next run

## Setup

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and create a new app
2. Under **OAuth & Permissions** → **Bot Token Scopes**, add `chat:write`
3. Install the app to your workspace and copy the **Bot User OAuth Token** (`xoxb-...`)
4. Find the **Channel ID** of the target channel (right-click the channel → "View channel details" → copy the ID)
5. Invite the Slack app to that channel: `/invite @your-app-name`

### 2. Deploy to Google Apps Script

```bash
# Authenticate clasp (first time only)
pnpm exec clasp login

# Create .clasp-dev.json with your script ID
echo '{"scriptId":"YOUR_SCRIPT_ID","rootDir":"dist"}' > .clasp-dev.json

# Check, build, and deploy
pnpm run deploy
```

### 3. Set Script Properties

In the Apps Script editor: Project Settings (gear icon) → Script Properties → add:

| Property | Description |
| --- | --- |
| `SLACK_BOT_TOKEN` | Slack Bot User OAuth Token (`xoxb-...`) |
| `SLACK_CHANNEL_ID` | Target channel ID (`C01234567` format) |

`LAST_PROCESSED_ROW` is set automatically on the first run of `checkNewRows` (defaults to `1` to skip the header row).

### 4. Set Up Trigger

Add optional Script Properties to configure the schedule:

| Property | Values | Default |
|----------|--------|---------|
| `TRIGGER_INTERVAL` | `1min`, `5min`, `10min`, `hourly`, `daily` | `5min` |
| `TRIGGER_HOUR` | `0`–`23` (only used with `daily`) | `9` |

Run `setupTrigger` in the Apps Script editor (▶). First run requires `script.scriptapp` scope authorization.

## Development Commands

| Command | Description |
| --- | --- |
| `pnpm run check` | lint + typecheck + test (all checks) |
| `pnpm run test` | Jest with coverage |
| `pnpm run test -- --watch` | Jest watch mode |
| `pnpm run build` | Bundle TypeScript and output to `dist/` |
| `pnpm run deploy` | check → build → clasp push to dev |
| `pnpm run deploy:prod` | check → build → clasp push to production |

## Project Structure

```
src/
├── index.ts          # GAS entry points (checkNewRows, setupTrigger)
├── sheet-reader.ts   # Spreadsheet row extraction logic
└── slack-message.ts  # Slack message payload builder
test/
├── sheet-reader.test.ts
└── slack-message.test.ts
```

## Notes

- Functions in `src/index.ts` must not have the `export` keyword — the GAS runtime does not support ES module syntax
- `src/index.ts` is excluded from test coverage because GAS globals (`SpreadsheetApp`, etc.) cannot run in Node.js
- Coverage threshold: 80% for all metrics (configurable in `jest.config.json`)
- `LAST_PROCESSED_ROW` defaults to `1` on first run to skip the header row

## Apps Script Projects

These projects are publicly viewable:

| Environment | Link |
|-------------|------|
| Development | [Open in Apps Script](https://script.google.com/d/1pfBRAp_JKYROuX_KD_4-EImm9SLQhU6CBgxnXKs-ev8wOzByF2QzEUjW/edit) |
| Production  | [Open in Apps Script](https://script.google.com/d/1qi5u32JHvWmIPpIcyNQEjLzdTjot21qCLpRlWR1BHm4nMq2LdPUw842i/edit) |

## License

MIT
