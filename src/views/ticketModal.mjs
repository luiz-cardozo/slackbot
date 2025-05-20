export const buildTicketModal = (ticketChannels, responseUrl) => ({
    type: "modal",
    callback_id: "ticket_submission",
    title: { type: "plain_text", text: "Abrir Ticket" },
    submit: { type: "plain_text", text: "Enviar" },
    close: { type: "plain_text", text: "Cancelar" },
    private_metadata: responseUrl,
    blocks: [
      {
        type: "input",
        block_id: "title_block",
        label: { type: "plain_text", text: "Título" },
        element: {
          type: "plain_text_input",
          action_id: "title_input",
          placeholder: { type: "plain_text", text: "[JIRA-123] Título do card" },
        },
      },
      {
        type: "input",
        block_id: "description_block",
        label: { type: "plain_text", text: "Descrição" },
        element: {
          type: "plain_text_input",
          multiline: true,
          action_id: "description_input",
          placeholder: {
            type: "plain_text",
            text: "Descreva o que foi realizado ou precisa ser debatido",
          },
        },
      },
      {
        type: "input",
        block_id: "channel_block",
        label: { type: "plain_text", text: "Onde você gostaria de abrir o ticket?" },
        element: {
          type: "static_select",
          action_id: "channel_select",
          options: ticketChannels,
          placeholder: {
            type: "plain_text",
            text: "Selecione o canal de abertura de tickets",
          },
        },
      },
      {
        type: "input",
        block_id: "users_block",
        label: { type: "plain_text", text: "Gostaria de marcar alguém?" },
        optional: true,
        element: {
          type: "multi_users_select",
          action_id: "users_select",
        },
      },
    ],
  });
  