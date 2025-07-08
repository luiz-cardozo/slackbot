const registerSupportCommand = (app) => {
  app.command('/suporte', async ({ ack, body, client, logger }) => {
    await ack();

    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'view_support',
          title: { type: 'plain_text', text: 'Solicitação de Suporte' },
          submit: { type: 'plain_text', text: 'Enviar Solicitação' },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Utilize este canal para reportar equipamentos com problemas, solicitar substituições ou a aquisição de novos itens. Por favor, inclua sempre o motivo e a justificativa para a solicitação, seguindo o modelo abaixo.',
              },
            },
            {
              type: 'input',
              block_id: 'equipment_block',
              label: {
                type: 'plain_text',
                text: 'Tipo de Equipamento',
              },
              element: {
                type: 'plain_text_input',
                action_id: 'equipment_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Ex: Monitor, Teclado, Mouse, Notebook',
                },
              },
            },
            {
              type: 'input',
              block_id: 'issue_block',
              label: {
                type: 'plain_text',
                text: 'Problema/Motivo da Solicitação',
              },
              element: {
                type: 'plain_text_input',
                action_id: 'issue_input',
                multiline: true,
                placeholder: {
                  type: 'plain_text',
                  text: 'Ex: Teclas falhando, tela com dead pixel, mouse não conecta...',
                },
              },
            },
            {
              type: 'input',
              block_id: 'justification_block',
              label: {
                type: 'plain_text',
                text: 'Justificativa para Substituição/Compra',
              },
              element: {
                type: 'plain_text_input',
                action_id: 'justification_input',
                multiline: true,
                placeholder: {
                  type: 'plain_text',
                  text: 'Ex: Impacta diretamente na produtividade diária...',
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      logger.error('Erro ao abrir o modal de suporte:', error);
    }
  });
};

export default registerSupportCommand;
