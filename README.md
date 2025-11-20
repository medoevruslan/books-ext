# Host Identifier Chrome Extension

This lightweight Chrome extension tells you which host the current tab is on. Open the popup and it instantly reads the active tab's URL and displays its hostname.

## Development

All source files are in the root of the repository:

- `manifest.json` – Chrome extension manifest (v3).
- `popup.html`, `popup.css`, `popup.js` – the UI that shows the detected host.

## Loading the Extension Locally

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** if it isn't already.
3. Click **Load unpacked** and select this project folder.
4. Pin the extension (optional), click the icon, and the popup will show the hostname of the current tab.

## Permissions

The extension requests the `tabs` permission to read the URL of the active tab. It also declares `<all_urls>` in `host_permissions` so Chrome allows access to the tab's host information.
