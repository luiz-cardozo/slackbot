export const buildMaterialModal = () => ({
    type: "modal",
    callback_id: "material_request",
    title: { type: "plain_text", text: "Solicitar Material" },
    submit: { type: "plain_text", text: "Enviar" },
    close: { type: "plain_text", text: "Cancelar" },
    blocks: [
      {
        type: "input",
        block_id: "material_block",
        label: { type: "plain_text", text: "Qual material você precisa?" },
        element: {
          type: "plain_text_input",
          action_id: "material_input",
          placeholder: { type: "plain_text", text: "Descreva o material necessário" },
        },
      },
      {
        type: "input",
        block_id: "quantity_block",
        label: { type: "plain_text", text: "Quantidade" },
        element: {
          type: "plain_text_input",
          action_id: "quantity_input",
          placeholder: { type: "plain_text", text: "Quantidade necessária" },
        },
      },
      {
        type: "input",
        block_id: "urgency_block",
        label: { type: "plain_text", text: "Urgência" },
        element: {
          type: "static_select",
          action_id: "urgency_select",
          options: [
            { text: { type: "plain_text", text: "Baixa" }, value: "low" },
            { text: { type: "plain_text", text: "Média" }, value: "medium" },
            { text: { type: "plain_text", text: "Alta" }, value: "high" },
          ],
          placeholder: { type: "plain_text", text: "Selecione a urgência" },
        },
      },
    ],
  });
  