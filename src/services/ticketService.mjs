import { slackClient } from "../utils/slackClient.mjs";
import { buildTicketModal } from "../views/ticketModal.mjs";
import { ticketSuccessModal } from "../views/ticketSuccessModal.mjs";


export async function openTicketModal(trigger_id, responseUrl) {
  const channelsResponse = await slackClient.conversations.list({
    types: "public_channel,private_channel",
  });

  const ticketChannels = channelsResponse.channels
    .filter((channel) => /^tickets-|-tickets$/i.test(channel.name))
    .map((channel) => ({
      text: {
        type: "plain_text",
        text: `#${channel.name}`,
        emoji: true,
      },
      value: channel.id,
    }));

  const view = buildTicketModal(ticketChannels, responseUrl);

  return slackClient.views.open({
    trigger_id,
    view,
  });
}

export async function handleTicketSubmission(payload) {
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

  const { permalink } = await slackClient.chat.getPermalink({
    channel: selectedChannel,
    message_ts: threadTs,
  });

  return ticketSuccessModal(permalink); // ✅ Apenas retorna o modal
}
