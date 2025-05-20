export function ticketSuccessModal(permalink) {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Ticket Criado",
    },
    close: {
      type: "plain_text",
      text: "Fechar",
      emoji: true,
    },
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":white_check_mark: Seu ticket foi criado com sucesso! Gostaria de anexar imagens de referência?",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Ver Ticket",
              emoji: true,
            },
            url: permalink,
            action_id: "go_to_thread",
          },
        ],
      },
    ],
  };
}
