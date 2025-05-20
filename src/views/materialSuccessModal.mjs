export function materialSuccessModal(material, quantity, urgencyText) {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Solicitação Enviada",
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
          text: ":white_check_mark: Sua solicitação de material foi enviada com sucesso!",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Material:* ${material}\n*Quantidade:* ${quantity}\n*Urgência:* ${urgencyText}`,
        },
      },
    ],
  };
}
