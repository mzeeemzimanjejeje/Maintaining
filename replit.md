# TRUTH-MD WhatsApp Bot

## Overview
A WhatsApp bot built with Node.js using the Baileys library (@whiskeysockets/baileys). It provides various commands for WhatsApp group management, AI chat, media downloading, and more.

## Project Architecture
- **Runtime**: Node.js 20
- **Entry Point**: `index.js`
- **Config**: `config.js` (API endpoints and keys)
- **Commands**: `commands/` directory (160+ command modules)
- **Libraries**: `lib/` directory (utility functions, store, admin checks, etc.)
- **Assets**: `assets/` directory (images, stickers, temp files)
- **Session Data**: Stored in `session/` or `auth_info_baileys/` (gitignored)

## Key Dependencies
- `@whiskeysockets/baileys` - WhatsApp Web API
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

## Recent Changes
- 2026-02-21: Initial Replit environment setup
  - Installed Node.js 20, ffmpeg, chromium
  - Configured Puppeteer to use system Chromium
  - Set up console workflow for bot execution
  - Configured VM deployment
