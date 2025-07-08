import { getFormattedRequesterName } from '../utils/user_utils.js';

const registerSupportView = (app) => {
  app.view('view_support', async ({ ack, body, view, client, logger }) => {
    await ack();

    const user = body.user.id;
    const values = view.state.values;
    const channelId = process.env.SUPPORT_CHANNEL_ID;

    const equipment = values.equipment_block.equipment_input.value;
    const issue = values.issue_block.issue_input.value;
    const justification = values.justification_block.justification_input.value;

    const requesterName = await getFormattedRequesterName(client, user, logger);

    const channelMessage = `🔧 *Nova Solicitação de Suporte* 🔧\n\n*Solicitante:* ${requesterName}\n\n*Tipo de Equipamento:*\n${equipment}\n\n*Problema/Motivo:*\n${issue}\n\n*Justificativa:*\n${justification}`;
    const userMessage = `Sua solicitação de suporte para *${equipment}* foi enviada com sucesso. Em breve a equipe responsável entrará em contato.`;

    try {
      if (!channelId) {
        logger.error(
          'A variável de ambiente SUPPORT_CHANNEL_ID não está definida.'
        );
        await client.chat.postEphemeral({
          user: user,
          channel: user,
          text: `A configuração do bot está incompleta. O administrador precisa definir o canal de suporte.`,
        });
        return;
      }

      await client.chat.postMessage({
        channel: channelId,
        text: channelMessage,
      });

      await client.chat.postEphemeral({
        user: user,
        channel: user,
        text: userMessage,
      });
    } catch (error) {
      logger.error('Erro ao processar a submissão da view de suporte:', error);
      await client.chat.postEphemeral({
        user: user,
        channel: user,
        text: `Houve um erro ao processar sua solicitação. Por favor, tente novamente.`,
      });
    }
  });
};

export default registerSupportView;
