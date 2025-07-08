import 'dotenv/config';
import pkg from '@slack/bolt';
const { App } = pkg;

import registerListeners from './src/listeners.js';

// --- INICIALIZAÇÃO DO APP (MODO HTTP) ---
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // As propriedades socketMode e appToken foram removidas.
});

// --- REGISTRO DOS OUVINTES (LISTENERS) ---
registerListeners(app);

// --- INICIALIZAÇÃO DO SERVIDOR ---
(async () => {
  // O app.start() agora irá iniciar um servidor web na porta especificada.
  await app.start(process.env.PORT || 3000);
  console.log('✅ Bot em execução no modo HTTP!');
})();