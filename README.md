# GhostMessages

> Leave no trace. Go ghost.

**GhostMessages** is a Vendetta plugin that automatically deletes every message you send the instant it hits Discord's servers — so it appears for a split second and then vanishes.

---

## Features

- 🔘 **Simple toggle** — enable or disable Ghost Mode from the plugin settings page at any time.
- ⚡ **Instant deletion** — hooks into `sendMessage` and calls `deleteMessage` as soon as Discord assigns a message ID.
- 🔒 **Persistent** — your toggle preference is saved across app restarts.

---

## How it works

The plugin patches Discord's internal `sendMessage` function. After your message is accepted by the API (so it gets a snowflake ID), the plugin immediately fires a `deleteMessage` request for that same ID. The result: the message flickers briefly in the channel and is gone.

---

## ⚠️ Disclaimer

- Recipients may still see your message in the brief window before deletion.
- Server logging bots can capture messages before they are deleted.
- Use responsibly and in accordance with Discord's Terms of Service.

---

## Installation

1. Open Vendetta → Plugins → `+`
2. Paste your plugin host URL pointing to this folder.
3. Toggle **Enable Ghost Mode** in the plugin settings.
