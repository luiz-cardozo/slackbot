import registerConductCommand from './commands/conduct_command.js';
import registerMaterialCommand from './commands/material_command.js';
import registerSupportCommand from './commands/support_command.js';
import registerTicketCommand from './commands/ticket_command.js';
import registerConductView from './views/conduct_view.js';
import registerMaterialView from './views/material_view.js';
import registerSupportView from './views/support_view.js';
import registerTicketView from './views/ticket_view.js';

const registerListeners = (app) => {
  console.log('Registrando ouvintes...');
  // /material
  registerMaterialCommand(app);
  registerMaterialView(app);

  // /ticket
  registerTicketCommand(app);
  registerTicketView(app);

  // /conduta
  registerConductCommand(app);
  registerConductView(app);

  // /suporte
  registerSupportCommand(app);
  registerSupportView(app);
};

export default registerListeners;
