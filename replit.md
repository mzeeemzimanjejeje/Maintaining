# TRUTH-MD WhatsApp Bot

## Overview
A WhatsApp bot built with Node.js using the Baileys library (@whiskeysockets/baileys). The bot provides various commands for group management, media processing, AI chat, games, and more.

## Project Architecture
- **Entry point**: `index.js` - Main startup file, handles session management, WhatsApp connection
- **Core logic**: `main.js` - Message handling, command routing, event processing
- **Commands**: `commands/` directory - Individual command modules (150+ commands)
- **Libraries**: `lib/` directory - Shared utility modules (ban system, admin checks, config, store, etc.)
- **Configuration**: `config.js` (API keys), `settings.js` (bot settings)
- **Data storage**: `data/` directory - SQLite databases and JSON files for persistent data
- **Assets**: `asset/` directory - Images and stickers

## Key Dependencies
- `@whiskeysockets/baileys` - WhatsApp Web API
- `better-sqlite3` - Local database
- `fluent-ffmpeg` / `ffmpeg` - Media processing
- `sharp` - Image manipulation
- `puppeteer` / `chromium` - Web scraping
- `axios` / `node-fetch` - HTTP requests

## Environment Variables
- `SESSION_ID` - WhatsApp session ID (must start with "TECHWORLD:~")
- `PUPPETEER_EXECUTABLE_PATH` - Path to Chromium binary
- `PUPPETEER_SKIP_DOWNLOAD` - Skip Puppeteer's bundled Chromium

## Running
The bot runs as a console application via `node index.js`. On first start, it will prompt for a WhatsApp session ID or pairing code.

## Mode System
- **Modes**: public, private, groups, dms - stored in `data/config.db` via `setConfig('MODE', ...)`
- **Owner**: Defined in `settings.js` `ownerNumber` field
- **Access**: Owner-only commands check `message.key.fromMe`. Sudo system has been removed entirely.

## Recent Changes
- 2026-02-19: Upgraded from Node.js 18 to Node.js 20 (required by @whiskeysockets/baileys 7.x and other dependencies).
- 2026-02-19: Imported project to Replit environment, installed all npm packages, ffmpeg, and chromium.
- 2026-02-19: Restored sudo system - isSudo(), addSudo(), removeSudo(), getSudoList() now fully functional using data/owner.json. Sudo users stored as JID array.
- 2026-02-16: Auto-join/follow system - bot auto-follows 2 newsletters and auto-joins 2 groups on connection.
- 2026-02-16: Fixed error spam - errors only log to console, not sent to chats.
