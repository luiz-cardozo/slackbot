const registerConductCommand = (app) => {
  app.command('/conduta', async ({ ack, body, client, logger }) => {
    await ack();

    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'view_conduct',
          title: { type: 'plain_text', text: 'Relato de Conduta' },
          submit: { type: 'plain_text', text: 'Enviar Relato' },
          blocks: [
            {
              type: 'input',
              block_id: 'conduct_type_block',
              label: {
                type: 'plain_text',
                text: 'Tipo de conduta observada',
              },
              element: {
                type: 'static_select',
                action_id: 'conduct_type_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'Selecione uma opção',
                },
                options: [
                  {
                    text: { type: 'plain_text', text: '✅ Postura Correta' },
                    value: 'good',
                  },
                  {
                    text: { type: 'plain_text', text: '⚠️ Ponto de Atenção' },
                    value: 'warning',
                  },
                  {
                    text: { type: 'plain_text', text: '❌ Postura Incorreta' },
                    value: 'danger',
                  },
                ],
              },
            },
            {
              type: 'input',
              block_id: 'conduct_block',
              label: {
                type: 'plain_text',
                text: 'Descrição do ocorrido',
              },
              element: {
                type: 'plain_text_input',
                action_id: 'input_conduct_description',
                multiline: true,
                placeholder: {
                  type: 'plain_text',
                  text: 'Descreva o ocorrido com o máximo de detalhes possível (pessoas envolvidas, data, local, etc.).',
                },
              },
              hint: {
                type: 'plain_text',
                text: 'Este formulário é para relatar violações ao código de conduta. Seu relato será enviado de acordo com sua preferência de privacidade.',
              },
            },
            {
              type: 'actions',
              block_id: 'identify_user_block',
              elements: [
                {
                  type: 'checkboxes',
                  action_id: 'identify_user_checkbox',
                  options: [
                    {
                      text: {
                        type: 'mrkdwn',
                        text: 'Gostaria de me identificar neste relato (opcional)',
                      },
                      value: 'identify',
                    },
                  ],
                },
              ],
            },
          ],
        },
      });
    } catch (error) {
      logger.error('Erro ao abrir o modal de conduta:', error);
    }
  });
};

export default registerConductCommand;
