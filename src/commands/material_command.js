const registerMaterialCommand = (app) => {
  app.command('/material', async ({ ack, body, client, logger }) => {
    await ack();

    try {
      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'material_request_view',
          title: { type: 'plain_text', text: 'Solicitar Material' },
          submit: { type: 'plain_text', text: 'Enviar Pedido' },
          blocks: [
            {
              type: 'input',
              block_id: 'material_block',
              element: {
                type: 'plain_text_input',
                action_id: 'material_name_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Adicione informações sobre o nome ou modelo do material',
                },
              },
              label: {
                type: 'plain_text',
                text: 'Qual material você gostaria de comprar?',
              },
            },
            {
              type: 'input',
              block_id: 'quantity_block',
              element: {
                type: 'number_input',
                is_decimal_allowed: false,
                action_id: 'quantity_input',
                placeholder: {
                  type: 'plain_text',
                  text: 'Insira apenas números',
                },
              },
              label: {
                type: 'plain_text',
                text: 'Qual a quantidade necessária?',
              },
            },
            {
              type: 'input',
              block_id: 'urgency_block',
              element: {
                type: 'static_select',
                action_id: 'urgency_level_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'Selecione o nível de urgência',
                },
                options: [
                  {
                    text: { type: 'plain_text', text: '🟢 Baixa' },
                    value: 'Baixa',
                  },
                  {
                    text: { type: 'plain_text', text: '🟡 Média' },
                    value: 'Média',
                  },
                  {
                    text: { type: 'plain_text', text: '🔴 Alta' },
                    value: 'Alta',
                  },
                ],
              },
              label: { type: 'plain_text', text: 'Nível de Urgência' },
            },
          ],
        },
      });
    } catch (error) {
      logger.error('Erro ao abrir o modal de material:', error);
    }
  });
};

export default registerMaterialCommand;
