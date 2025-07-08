import { findChannelsEndingWith } from '../utils/channel_utils.js';

const registerTicketCommand = (app) => {
  app.command('/ticket', async ({ ack, body, client, logger }) => {
    await ack();

    let viewId = null;

    try {
      const loadingView = await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          title: { type: 'plain_text', text: 'Criando Ticket' },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Buscando canais, por favor aguarde... ⏳',
              },
            },
          ],
        },
      });

      viewId = loadingView.view.id;

      const ticketChannels = await findChannelsEndingWith(
        client,
        'tickets',
        logger
      );

      await client.views.update({
        view_id: viewId,
        view: {
          type: 'modal',
          callback_id: 'ticket_request_view',
          title: { type: 'plain_text', text: 'Novo Ticket de Progresso' },
          submit: { type: 'plain_text', text: 'Postar' },
          blocks: [
            {
              type: 'input',
              block_id: 'title_block',
              element: {
                type: 'plain_text_input',
                action_id: 'title_input',
                placeholder: {
                  type: 'plain_text',
                  text: '[JIRA-123] Adicione o título do card do jira',
                },
              },
              label: { type: 'plain_text', text: 'Título' },
            },
            {
              type: 'input',
              block_id: 'description_block',
              element: {
                type: 'plain_text_input',
                action_id: 'description_input',
                multiline: true,
                placeholder: {
                  type: 'plain_text',
                  text: 'Descreva o progresso realizado',
                },
              },
              label: { type: 'plain_text', text: 'Descrição' },
            },
            {
              type: 'input',
              block_id: 'channel_block',
              element: {
                type: 'static_select',
                action_id: 'channel_select',
                placeholder: { type: 'plain_text', text: 'Selecione um canal' },
                options: ticketChannels,
              },
              label: { type: 'plain_text', text: 'Canal para publicação' },
            },
            {
              type: 'input',
              block_id: 'users_block',
              element: {
                type: 'multi_users_select',
                action_id: 'users_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'Selecione os usuários',
                },
              },
              label: { type: 'plain_text', text: 'Marcar usuários (opcional)' },
              optional: true,
            },
            {
              type: 'input',
              block_id: 'files_block',
              element: {
                type: 'file_input',
                action_id: 'files_input',
                max_files: 5,
              },
              label: {
                type: 'plain_text',
                text: 'Adicionar anexos',
              },
              optional: true,
            },
          ],
        },
      });
    } catch (error) {
      logger.error('Erro ao abrir o modal de ticket:', error);
      if (viewId) {
        await client.views.update({
          view_id: viewId,
          view: {
            type: 'modal',
            title: { type: 'plain_text', text: 'Erro' },
            close: { type: 'plain_text', text: 'Fechar' },
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'Ocorreu um erro ao buscar a lista de canais. Verifique as permissões do bot e tente novamente.',
                },
              },
            ],
          },
        });
      }
    }
  });
};

export default registerTicketCommand;
