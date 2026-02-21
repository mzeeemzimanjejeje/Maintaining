# TRUTH-MD WhatsApp Bot

## Overview
A WhatsApp bot built with Node.js using the Baileys library (@whiskeysockets/baileys v7.0.0-rc.9). It provides various commands for WhatsApp group management, AI chat, media downloading, and more.

## Project Architecture
- **Runtime**: Node.js 20
- **Entry Point**: `index.js`
- **Config**: `config.js` (API endpoints and keys)
- **Commands**: `commands/` directory (160+ command modules)
- **Libraries**: `lib/` directory (utility functions, store, admin checks, etc.)
- **Assets**: `assets/` directory (images, stickers, temp files)
- **Session Data**: Stored in `session/` or `auth_info_baileys/` (gitignored)
- **Patches**: `scripts/patch-baileys.js` (auto-applied via postinstall)

## Key Dependencies
- `@whiskeysockets/baileys` v7.0.0-rc.9 - WhatsApp Web API (uses ev.process() for events)
- `sharp` - Image processing
- `fluent-ffmpeg` / `ffmpeg` - Media conversion
- `puppeteer` + Chromium - Web scraping
- `axios` - HTTP requests
- `dotenv` - Environment variable management

## System Dependencies
- ffmpeg (media processing)
- chromium (puppeteer/web scraping)

## Environment Variables
- `SESSION_ID` - WhatsApp session ID (required to connect)
- `OWNER_NUMBER` - Bot owner's WhatsApp number
- `PUPPETEER_EXECUTABLE_PATH` - Path to system Chromium
- `PUPPETEER_SKIP_DOWNLOAD` - Skip bundled Chromium download

## Deployment
- Type: VM (always-on, stateful)
- Run command: `node index.js`

## Known Issues & Fixes

### Baileys v7 Offline Buffer Fix (Critical)
- **Problem**: `CB:ib,,offline` WebSocket event never fires in some environments, causing the initial event buffer to never flush. This prevents ALL message events from reaching handlers.
- **Fix**: Added a 5-second safety timeout in `socket.js` that force-flushes the buffer and emits `receivedPendingNotifications: true` if the offline event doesn't arrive. Applied via `scripts/patch-baileys.js` (runs as postinstall).
- **File**: `node_modules/@whiskeysockets/baileys/lib/Socket/socket.js`

### Session Key Corruption
- **Problem**: "Bad MAC Error" during message decryption indicates corrupted session encryption keys. This prevents the bot from decrypting incoming messages.
- **Solution**: Generate a new SESSION_ID and clear old session files. This happens when sessions are used across multiple platforms or Baileys versions simultaneously.

## Recent Changes
- 2026-02-21: Initial Replit environment setup
  - Installed Node.js 20, ffmpeg, chromium
  - Configured Puppeteer to use system Chromium
  - Set up console workflow for bot execution
  - Configured VM deployment
- 2026-02-21: Baileys v7 compatibility fixes
  - Migrated event system from ev.on() to ev.process() API
  - Fixed MODE from "private" to "public" in config database
  - Fixed /help command typo
  - Added colorful console log format using chalk
- 2026-02-21: Critical offline buffer fix
  - Diagnosed CB:ib,,offline event never firing
  - Added force-flush safety timeout in socket.js
  - Created persistent patch script (scripts/patch-baileys.js)
  - Added postinstall script to package.json for automatic patching
  - Confirmed event pipeline properly transitions through AwaitingInitialSync → Online
