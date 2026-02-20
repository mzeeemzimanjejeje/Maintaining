const settings = require('../settings');
const { getOwnerNumber } = require('./setownernumber');

const EMOJI = "👑";

function normalizeJidToDigits(jid) {
  if (!jid) return "";
  const local = jid.split("@")[0];
  return local.replace(/\D/g, "");
}

function getOwnerNumbers() {
  const numbers = [];

  try {
    const dynOwner = getOwnerNumber();
    if (dynOwner) {
      numbers.push(normalizeJidToDigits(dynOwner));
    }
  } catch (e) {}

  if (settings.ownerNumber) {
    numbers.push(normalizeJidToDigits(settings.ownerNumber));
  }

  return numbers.filter(n => n.length > 0);
}

function isOwnerNumber(num) {
  const owners = getOwnerNumbers();
  return owners.some(owner =>
    num === owner ||
    num.endsWith(owner) ||
    owner.endsWith(num)
  );
}

async function handleDevReact(sock, msg) {
  try {
    if (!msg?.key || !msg.message) return;

    const remoteJid = msg.key.remoteJid || "";
    const isGroup = remoteJid.endsWith("@g.us");

    const rawSender = isGroup ? msg.key.participant : msg.key.remoteJid;
    const digits = normalizeJidToDigits(rawSender);

    if (!digits || !isOwnerNumber(digits)) return;

    const botNumber = normalizeJidToDigits(sock.user?.id || "");
    if (digits === botNumber) return;

    await sock.sendMessage(remoteJid, {
      react: { text: "", key: msg.key }
    });

    await new Promise(r => setTimeout(r, 300));

    await sock.sendMessage(remoteJid, {
      react: { text: EMOJI, key: msg.key }
    });

  } catch (err) {
    console.error('devReact error:', err.message);
  }
}

module.exports = { handleDevReact };
