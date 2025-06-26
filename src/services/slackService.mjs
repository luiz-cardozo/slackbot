import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const getTicketChannels = async () => {
  const channelsResponse = await slackClient.conversations.list({
    types: "public_channel,private_channel",
  });
  return channelsResponse.channels
    .filter((channel) => {
      const channelName = channel.name.toLowerCase();
      return channelName.startsWith("tickets") || channelName.endsWith("tickets");
    })
    .map((channel) => ({
      text: { type: "plain_text", text: `#${channel.name}`, emoji: true },
      value: channel.id,
    }));
};

const buildTicketModal = (channels, responseUrl) => ({
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
        placeholder: { type: "plain_text", text: "Descreva o que foi realizado ou precisa ser debatido" },
      },
    },
    {
      type: "input",
      block_id: "channel_block",
      label: { type: "plain_text", text: "Onde você gostaria de abrir o ticket?" },
      element: {
        type: "static_select",
        action_id: "channel_select",
        options: channels,
        placeholder: { type: "plain_text", text: "Selecione o canal" },
      },
    },
    {
      type: "input",
      block_id: "users_block",
      label: { type: "plain_text", text: "Gostaria de marcar alguém?" },
      optional: true,
      element: { type: "multi_users_select", action_id: "users_select" },
    },
  ],
});

const buildMaterialModal = () => ({
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
        placeholder: { type: "plain_text", text: "Descreva o material" },
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


const buildSupportModal = () => ({
  type: "modal",
  callback_id: "support_request",
  title: { type: "plain_text", text: "Solicitar Suporte" },
  submit: { type: "plain_text", text: "Enviar" },
  close: { type: "plain_text", text: "Cancelar" },
  blocks: [
    {
      type: "input",
      block_id: "equipment_block",
      label: { type: "plain_text", text: "Qual equipamento você precisa de suporte?" },
      element: {
        type: "plain_text_input",
        action_id: "equipment_input",
        placeholder: { type: "plain_text", text: "Ex: teclado falhando, dead pixel na tela..." },
      },
    },
    {
      type: "input",
      block_id: "justification_block",
      label: { type: "plain_text", text: "Detalhe a sua demanda e justifique a necessidade" },
      element: {
        type: "plain_text_input",
        action_id: "justification_input",
        placeholder: { type: "plain_text", text: "Ex: novo projeto demanda maior capacidade de processamento" },
      },
    },
    {
      type: "input",
      block_id: "name_block",
      label: { type: "plain_text", text: "Adicione seu nome e área" },
      element: {
        type: "plain_text_input",
        action_id: "name_input",
        placeholder: { type: "plain_text", text: "Ex: Roberval - Bot" },
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

const openModal = async (trigger_id, view) => {
  await slackClient.views.open({ trigger_id, view });
};

const handleTicketSubmission = async (payload, res) => {
  const values = payload.view.state.values;
  const title = values.title_block.title_input.value;
  const description = values.description_block.description_input.value;
  const selectedChannel = values.channel_block.channel_select.selected_option.value;
  const mentionedUsers = values.users_block?.users_select.selected_users || [];

  const result = await slackClient.chat.postMessage({
    channel: selectedChannel,
    text: `:ticket: ${title}`,
  });

  const threadTs = result.ts;
  const mentionsText = mentionedUsers.map((user) => `<@${user}>`).join(" ");

  await slackClient.chat.postMessage({
    channel: selectedChannel,
    thread_ts: threadTs,
    text: `${description} ${mentionsText}`,
  });

  const threadPermalinkResponse = await slackClient.chat.getPermalink({
    channel: selectedChannel,
    message_ts: threadTs,
  });

  return res.json({
    response_action: "update",
    view: {
      type: "modal",
      title: { type: "plain_text", text: "Ticket Criado" },
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: ":white_check_mark: Seu ticket foi criado com sucesso!" },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "Ver ticket" },
              url: threadPermalinkResponse.permalink,
              action_id: "go_to_thread",
            },
          ],
        },
      ],
    },
  });
};

const handleMaterialRequest = async (payload, res) => {
  const values = payload.view.state.values;
  const material = values.material_block.material_input.value;
  const quantity = values.quantity_block.quantity_input.value;
  const urgency = values.urgency_block.urgency_select.selected_option.value;
  const channel = process.env.MATERIALS_CHANNEL_ID;
  const urgencyText = { low: "Baixa", medium: "Média", high: "Alta" }[urgency];

  await slackClient.chat.postMessage({
    channel,
    text: `:package: Nova solicitação de material\n*Material:* ${material}\n*Quantidade:* ${quantity}\n*Urgência:* ${urgencyText}`,
  });

  return res.json({
    response_action: "update",
    view: {
      type: "modal",
      title: { type: "plain_text", text: "Solicitação Enviada" },
      close: { type: "plain_text", text: "Fechar" },
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: ":white_check_mark: Sua solicitação de material foi enviada com sucesso!" },
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*Material:* ${material}\n*Quantidade:* ${quantity}\n*Urgência:* ${urgencyText}` },
        },
      ],
    },
  });
};

const handleSupportRequest = async (payload, res) => {
  const values = payload.view.state.values;
  const equipment = values.equipment_block.equipment_input.value;
  const justification = values.justification_block.justification_input.value;
  const name = values.name_block.name_input.value;
  const channel = process.env.SUPPORT_CHANNEL_ID;
  const urgencyText = { low: "Baixa", medium: "Média", high: "Alta" }[urgency];

  await slackClient.chat.postMessage({
    channel,
    text: `:package: Nova solicitação de suporte\n*Equipamento:* ${material}\n*Justificativa:* ${justification}\n*Solicitante:* ${name}\n*Urgência:* ${urgencyText}`,
  });

  return res.json({
    response_action: "update",
    view: {
      type: "modal",
      title: { type: "plain_text", text: "Solicitação Enviada" },
      close: { type: "plain_text", text: "Fechar" },
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: ":white_check_mark: Sua solicitação de suporte foi enviada com sucesso!" },
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*Equipamento:* ${equipment}\n*Justificativa:* ${justification}\n*Nome:* ${userId}\n*Urgência:* ${urgencyText}` },
        },
      ],
    },
  });
};

export default {
  getTicketChannels,
  buildTicketModal,
  buildMaterialModal,
  buildSupportModal,
  openModal,
  handleTicketSubmission,
  handleMaterialRequest,
  handleSupportRequest
};
