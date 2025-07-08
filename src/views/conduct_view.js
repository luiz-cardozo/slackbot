import { getFormattedRequesterName } from '../utils/user_utils.js';

const registerConductView = (app) => {
  app.action('identify_user_checkbox', async ({ ack }) => {
    await ack();
  });

  app.view('view_conduct', async ({ ack, body, view, client, logger }) => {
    await ack();

    const user = body.user.id;
    const values = view.state.values;
    const channelId = process.env.CONDUCT_CHANNEL_ID;

    const conductType =
      values.conduct_type_block.conduct_type_select.selected_option;
    const report = values.conduct_block.input_conduct_description.value;

    const identifyUser =
      values.identify_user_block.identify_user_checkbox.selected_options
        .length > 0;

    const ephemeralMessage = `Seu relato foi enviado. Obrigado por contribuir para um ambiente seguro. ✅`;

    const conductInfo = {
      good: { emoji: '✅', text: 'Novo relato de Postura Correta' },
      warning: { emoji: '⚠️', text: 'Novo relato de Ponto de Atenção' },
      danger: { emoji: '❌', text: 'Novo relato de Postura Incorreta' },
    };

    const selectedConduct =
      conductInfo[conductType.value] || conductInfo.warning;

    try {
      if (!channelId) {
        logger.error(
          'A variável de ambiente CONDUCT_CHANNEL_ID não está definida.'
        );
        await client.chat.postEphemeral({
          user: user,
          channel: user,
          text: `A configuração do bot está incompleta. O administrador precisa definir o canal de conduta.`,
        });
        return;
      }

      let contextText = 'Relato enviado de forma anônima.';
      if (identifyUser) {
        const requesterName = await getFormattedRequesterName(
          client,
          user,
          logger
        );
        contextText = `Relato enviado por ${requesterName}.`;
      }

      await client.chat.postMessage({
        channel: channelId,
        text: `🚨 ${selectedConduct.text}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${selectedConduct.emoji} ${selectedConduct.text}`,
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Relato Recebido:*\n>>>${report}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: contextText,
              },
            ],
          },
        ],
      });

      await client.chat.postEphemeral({
        user: user,
        channel: user,
        text: ephemeralMessage,
      });
    } catch (error) {
      logger.error('Erro ao processar a submissão da view de conduta:', error);
      await client.chat.postEphemeral({
        user: user,
        channel: user,
        text: `Houve um erro ao processar sua solicitação. Por favor, tente novamente.`,
      });
    }
  });
};

export default registerConductView;
