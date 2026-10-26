const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');
const qrcode = require('qrcode-terminal');

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['Faisal-MD','Chrome','1.0']
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u) => {
    if(u.qr) qrcode.generate(u.qr, {small:true});
    if(u.connection === 'open') console.log('Faisal-MD Connected! 923136726776');
  });
  sock.ev.on('messages.upsert', async ({messages}) => {
    const msg = messages[0];
    if(!msg.message) return;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    if(text.toLowerCase() === '.ping') {
      await sock.sendMessage(msg.key.remoteJid, {text:'Pong! Faisal-MD Online 🚀'});
    }
    if(text.toLowerCase() === '.menu') {
      await sock.sendMessage(msg.key.remoteJid, {text:'*Faisal-MD Menu*\n\n.ping - check bot\n.menu - this menu\nOwner: 923136726776'});
    }
  });
}
start();