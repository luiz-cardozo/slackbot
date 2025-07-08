import { getFormattedRequesterName } from '../utils/user_utils.js';

const registerMaterialView = (app) => {
  app.view(
    'material_request_view',
    async ({ ack, body, view, client, logger }) => {
      await ack();

      const user = body.user.id;
      const values = view.state.values;
      const channelId = process.env.MATERIALS_CHANNEL_ID;

      const material = values.material_block.material_name_input.value;
      const quantity = values.quantity_block.quantity_input.value;
      const urgency =
        values.urgency_block.urgency_level_select.selected_option.value;

      const requesterText = await getFormattedRequesterName(
        client,
        user,
        logger
      );

      const channelMessage = `🖊️ *Nova Solicitação de Material* 🖊️\n\n*Solicitante:* ${requesterText}\n*Material:* ${material}\n*Quantidade:* ${quantity}\n*Urgência:* ${urgency}`;
      const userMessage = `Sua solicitação para comprar *${quantity}x ${material}* (urgência: *${urgency}*) foi registrada com sucesso! ✅`;

      try {
        if (!channelId) {
          logger.error(
            'A variável de ambiente MATERIALS_CHANNEL_ID não está definida.'
          );
          await client.chat.postEphemeral({
            user: user,
            channel: user,
            text: `A configuração do bot está incompleta. O administrador precisa definir o canal de materiais.`,
          });
          return;
        }

        await client.chat.postMessage({
          channel: channelId,
          text: channelMessage,
          mrkdwn: true,
        });

        await client.chat.postEphemeral({
          user: user,
          channel: user,
          text: userMessage,
        });
      } catch (error) {
        logger.error(
          'Erro ao processar a submissão da view de material:',
          error
        );
        await client.chat.postEphemeral({
          user: user,
          channel: user,
          text: `Houve um erro ao processar sua solicitação. Por favor, tente novamente.`,
        });
      }
    }
  );
};

export default registerMaterialView;
