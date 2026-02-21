const fs = require('fs');
const path = require('path');

const SOCKET_FILE = path.join(__dirname, '..', 'node_modules', '@whiskeysockets', 'baileys', 'lib', 'Socket', 'socket.js');
const MESSAGES_RECV_FILE = path.join(__dirname, '..', 'node_modules', '@whiskeysockets', 'baileys', 'lib', 'Socket', 'messages-recv.js');

if (!fs.existsSync(SOCKET_FILE)) {
    console.log('[patch-baileys] socket.js not found, skipping patch');
    process.exit(0);
}

let content = fs.readFileSync(SOCKET_FILE, 'utf-8');

if (!content.includes('force-flushing buffer and signaling readiness')) {
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

    if (content.includes(ORIGINAL)) {
        content = content.replace(ORIGINAL_BUFFER, PATCHED_BUFFER);
        content = content.replace(ORIGINAL, PATCHED);
        fs.writeFileSync(SOCKET_FILE, content, 'utf-8');
        console.log('[patch-baileys] Successfully patched socket.js with offline flush safety timeout');
    } else {
        console.log('[patch-baileys] socket.js patch already applied or not compatible');
    }
} else {
    console.log('[patch-baileys] socket.js patch already applied, skipping');
}

if (fs.existsSync(MESSAGES_RECV_FILE)) {
    let recvContent = fs.readFileSync(MESSAGES_RECV_FILE, 'utf-8');

    if (!recvContent.includes('// silenced mex newsletter')) {
        recvContent = recvContent.replace(
            `logger.warn({ node }, 'Invalid mex newsletter notification');`,
            `// silenced mex newsletter\n            return;`
        );
        recvContent = recvContent.replace(
            `logger.warn({ data }, 'Invalid mex newsletter notification content');`,
            `// silenced mex newsletter content\n            return;`
        );
        fs.writeFileSync(MESSAGES_RECV_FILE, recvContent, 'utf-8');
        console.log('[patch-baileys] Silenced mex newsletter notification warnings');
    } else {
        console.log('[patch-baileys] Newsletter warnings already silenced');
    }
} else {
    console.log('[patch-baileys] messages-recv.js not found, skipping newsletter patch');
}
