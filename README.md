# Aetherneedle

> The needle that pierces the web. Clip anything. Forget nothing.

Part of the **Magiloom** second-brain ecosystem alongside [Magicite](https://github.com/jackfperryjr/magicite) and [Crystarium](https://github.com/jackfperryjr/crystarium).

---

## What it does

Aetherneedle is a Chrome extension that turns any page into a node in your knowledge graph. One click captures the page's content, sends it to Magicite for AI processing, and deposits the enriched clip into your Crystarium — tagged, summarized, embedded, and ready to connect.

- **Side panel** — a persistent workspace that lives alongside any tab
- **Context menu** — right-click any selection to clip just what matters
- **Google sign-in** — your clips are private and scoped to your account
- **Zero friction** — no forms, no tags required. The graph builds itself.

---

## Stack

| Layer | Technology |
|---|---|
| Platform | Chrome Extension — Manifest V3 |
| UI | React + Tailwind CSS |
| Build | Vite + @crxjs/vite-plugin |
| Auth | Supabase — Google OAuth via `chrome.identity` |

---

## Installation

Aetherneedle is distributed as a zip via GitHub Releases. Chrome Web Store listing coming soon.

1. Download `aetherneedle.zip` from the [latest release](../../releases/latest)
2. Unzip the file — you'll get a folder of extension assets
3. Open Chrome and navigate to `chrome://extensions`
4. Enable **Developer mode** (toggle in the top-right corner)
5. Click **Load unpacked** and select the unzipped folder
6. The Aetherneedle icon will appear in your toolbar — pin it for easy access
7. Click the icon to open the side panel and sign in with Google
