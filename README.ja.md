# apps-script-slack-notifier

[![CI](https://github.com/h13/apps-script-slack-notifier/actions/workflows/ci.yml/badge.svg)](https://github.com/h13/apps-script-slack-notifier/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/h13/apps-script-slack-notifier/blob/main/LICENSE)
[![Node.js >=24](https://img.shields.io/badge/Node.js-%3E%3D24-brightgreen.svg)](https://nodejs.org/)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4.svg?logo=google&logoColor=white)](https://script.google.com/)

[English](README.md)

Google スプレッドシートに追加された新しい行を検知し、Bot Token 経由で Slack の `chat.postMessage` API に通知する Google Apps Script プロジェクト。[apps-script-fleet](https://github.com/h13/apps-script-fleet) テンプレートから生成。

## 動作の仕組み

1. **時間駆動トリガー** — Google Apps Script のタイムトリガーが `checkNewRows` を定期実行（例: 5 分ごと）
2. **新規行の検出** — スプレッドシート全行を取得し、前回処理した行インデックス（`LAST_PROCESSED_ROW`）以降の行を抽出
3. **Slack 通知** — `UrlFetchApp.fetch` で `https://slack.com/api/chat.postMessage` を呼び出し、新規行の内容を通知
4. **状態の更新** — `PropertiesService` に最終処理行インデックスを保存し、次回実行時の重複通知を防止

## セットアップ

### 1. Slack App の作成

1. [api.slack.com/apps](https://api.slack.com/apps) にアクセスし、新しい App を作成
2. **OAuth & Permissions** → **Bot Token Scopes** に `chat:write` を追加
3. App をワークスペースにインストールし、**Bot User OAuth Token**（`xoxb-...`）を取得
4. 通知先チャンネルの **Channel ID** を確認（チャンネルを右クリック → "チャンネル詳細を表示" → ID をコピー）
5. Slack App をそのチャンネルに招待: `/invite @your-app-name`

### 2. Google Apps Script へのデプロイ

```bash
# clasp 認証（初回のみ）
pnpm exec clasp login

# .clasp-dev.json を作成してスクリプト ID を設定
echo '{"scriptId":"YOUR_SCRIPT_ID","rootDir":"dist"}' > .clasp-dev.json

# チェック → ビルド → デプロイ
pnpm run deploy
```

### 3. Script Properties の設定

Apps Script エディタ: プロジェクトの設定（歯車アイコン）→ スクリプト プロパティ → 以下を追加:

| プロパティ | 説明 |
| --- | --- |
| `SLACK_BOT_TOKEN` | Slack Bot User OAuth Token (`xoxb-...`) |
| `SLACK_CHANNEL_ID` | 通知先チャンネル ID（`C01234567` 形式） |

`LAST_PROCESSED_ROW` は初回の `checkNewRows` 実行時に自動設定されます（デフォルト: `1` でヘッダー行をスキップ）。

### 4. トリガーの設定

Script Properties でスケジュールを設定（任意）:

| プロパティ | 値 | デフォルト |
|------------|------|-----------|
| `TRIGGER_INTERVAL` | `1min`, `5min`, `10min`, `hourly`, `daily` | `5min` |
| `TRIGGER_HOUR` | `0`〜`23`（`daily` 時のみ使用） | `9` |

Apps Script エディタで `setupTrigger` を選択して ▶ 実行。初回は `script.scriptapp` スコープの承認が必要。

## 開発コマンド

| コマンド | 説明 |
| --- | --- |
| `pnpm run check` | lint + typecheck + test（全チェック） |
| `pnpm run test` | Jest（カバレッジ付き） |
| `pnpm run test -- --watch` | Jest ウォッチモード |
| `pnpm run build` | TypeScript をバンドルして `dist/` に出力 |
| `pnpm run deploy` | check → build → dev 環境へ clasp push |
| `pnpm run deploy:prod` | check → build → 本番環境へ clasp push |

## プロジェクト構成

```
src/
├── index.ts          # GAS エントリポイント（checkNewRows, setupTrigger）
├── sheet-reader.ts   # スプレッドシート行抽出ロジック
└── slack-message.ts  # Slack メッセージペイロード構築ロジック
test/
├── sheet-reader.test.ts
└── slack-message.test.ts
```

## 注意事項

- `src/index.ts` の関数に `export` キーワードは付けない（GAS ランタイムは ES モジュール構文を認識できない）
- `src/index.ts` はテストカバレッジ対象外（GAS グローバル `SpreadsheetApp` 等が Node.js 環境で実行不可のため）
- カバレッジ閾値: 全メトリクス 80%（`jest.config.json` で変更可）
- `LAST_PROCESSED_ROW` は初回実行時にデフォルト値 `1` が設定され、ヘッダー行をスキップします

## Apps Script プロジェクト

これらのプロジェクトは閲覧可能です:

| 環境 | リンク |
|------|--------|
| Development | [Apps Script で開く](https://script.google.com/d/1pfBRAp_JKYROuX_KD_4-EImm9SLQhU6CBgxnXKs-ev8wOzByF2QzEUjW/edit) |
| Production  | [Apps Script で開く](https://script.google.com/d/1qi5u32JHvWmIPpIcyNQEjLzdTjot21qCLpRlWR1BHm4nMq2LdPUw842i/edit) |

## ライセンス

MIT
