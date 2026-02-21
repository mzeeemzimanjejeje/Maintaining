const fs = require('fs');
const path = require('path');

const SOCKET_FILE = path.join(__dirname, '..', 'node_modules', '@whiskeysockets', 'baileys', 'lib', 'Socket', 'socket.js');

if (!fs.existsSync(SOCKET_FILE)) {
    console.log('[patch-baileys] socket.js not found, skipping patch');
    process.exit(0);
}

let content = fs.readFileSync(SOCKET_FILE, 'utf-8');

if (content.includes('force-flushing buffer and signaling readiness')) {
    console.log('[patch-baileys] Patch already applied, skipping');
    process.exit(0);
}

const ORIGINAL = `    // called when all offline notifs are handled
    ws.on('CB:ib,,offline', (node) => {
        const child = getBinaryNodeChild(node, 'offline');
        const offlineNotifs = +(child?.attrs.count || 0);
        logger.info(\`handled \${offlineNotifs} offline messages/notifications\`);
        if (didStartBuffer) {
            ev.flush();
            logger.trace('flushed events for initial buffer');
        }
        ev.emit('connection.update', { receivedPendingNotifications: true });
    });`;

const PATCHED = `    // called when all offline notifs are handled
    ws.on('CB:ib,,offline', (node) => {
        const child = getBinaryNodeChild(node, 'offline');
        const offlineNotifs = +(child?.attrs.count || 0);
        logger.info(\`handled \${offlineNotifs} offline messages/notifications\`);
        offlineHandled = true;
        if (didStartBuffer) {
            ev.flush();
            logger.trace('flushed events for initial buffer');
        }
        ev.emit('connection.update', { receivedPendingNotifications: true });
    });
    setTimeout(() => {
        if (!offlineHandled && didStartBuffer) {
            logger.warn('CB:ib,,offline never fired, force-flushing buffer and signaling readiness');
            offlineHandled = true;
            ev.flush();
            ev.emit('connection.update', { receivedPendingNotifications: true });
        }
    }, 5000);`;

const ORIGINAL_BUFFER = `    let didStartBuffer = false;`;
const PATCHED_BUFFER = `    let didStartBuffer = false;\n    let offlineHandled = false;`;

if (!content.includes(ORIGINAL)) {
    console.log('[patch-baileys] Could not find target code block, patch may not be compatible with this version');
    process.exit(0);
}

content = content.replace(ORIGINAL_BUFFER, PATCHED_BUFFER);
content = content.replace(ORIGINAL, PATCHED);

fs.writeFileSync(SOCKET_FILE, content, 'utf-8');
console.log('[patch-baileys] Successfully patched socket.js with offline flush safety timeout');
