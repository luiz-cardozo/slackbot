import { getFormattedRequesterName } from '../utils/user_utils.js';

const registerTicketView = (app) => {
  app.view(
    'ticket_request_view',
    async ({ ack, body, view, client, logger }) => {
      await ack();

      const user = body.user.id;
      const values = view.state.values;

      // Extrai os valores do formulário
      const title = values.title_block.title_input.value;
      const description = values.description_block.description_input.value;
      const selectedChannel =
        values.channel_block.channel_select.selected_option.value;
      const selectedUsers = values.users_block.users_select.selected_users;

      // Extrai os arquivos da forma mais robusta, diretamente do estado do bloco.
      const files = values.files_block.files_input.files || [];

      // Log de diagnóstico para verificar se os arquivos estão sendo recebidos.
      /*
      logger.info(`Recebidos ${files.length} arquivos para o ticket.`);
      if (files.length > 0) {
        logger.info('Detalhes dos arquivos:', JSON.stringify(files, null, 2));
      }
      */

      // Formata as menções dos usuários selecionados
      const usersToMention = selectedUsers.map((u) => `<@${u}>`).join(' ');

      try {
        // 1. Posta a mensagem principal (o título)
        const mainMessage = await client.chat.postMessage({
          channel: selectedChannel,
          text: `*${title}* | Postado por: <@${user}>`,
        });

        // 2. Posta a resposta em thread com a descrição e as marcações
        await client.chat.postMessage({
          channel: selectedChannel,
          thread_ts: mainMessage.ts, // Usa o timestamp da mensagem principal para criar a thread
          text: `${description}\n\nCc: ${usersToMention}`,
        });

        // 3. Faz o upload dos arquivos para a thread, se houver algum
        if (files.length > 0) {
          logger.info(`Iniciando upload de ${files.length} arquivo(s)...`);
          await Promise.all(
            files.map(async (file) => {
              // O bot precisa baixar o arquivo temporariamente para depois fazer o upload
              const response = await fetch(file.url_private, {
                headers: {
                  Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                },
              });
              const fileBuffer = Buffer.from(await response.arrayBuffer());

              // Faz o upload do arquivo para a thread usando a API V2 (moderna)
              await client.files.uploadV2({
                channel_id: selectedChannel,
                thread_ts: mainMessage.ts,
                filename: file.name,
                file: fileBuffer,
                initial_comment: `Anexo adicionado por <@${user}>:`,
              });
            })
          );
          logger.info('Upload de arquivos concluído.');
        }

        // 4. Obtém o link permanente para a mensagem principal
        const permalinkResult = await client.chat.getPermalink({
          channel: selectedChannel,
          message_ts: mainMessage.ts,
        });

        // 5. Monta a mensagem efêmera com o link e as instruções
        let userMessage = `Seu ticket foi postado! Acesse a thread <${permalinkResult.permalink}|clicando aqui> para adicionar mais informações.`;
        if (files.length > 0) {
          userMessage = `Seu ticket e ${files.length} anexo(s) foram postados! Acesse a thread <${permalinkResult.permalink}|clicando aqui> para ver e adicionar mais informações.`;
        }

        // 6. Envia a mensagem efêmera de confirmação para o usuário
        await client.chat.postEphemeral({
          channel: selectedChannel,
          user: user,
          text: userMessage,
        });
      } catch (error) {
        logger.error('Erro ao postar o ticket:', error);
        await client.chat.postEphemeral({
          channel: user,
          user: user,
          text: `Houve um erro ao postar seu ticket. Verifique se o bot está no canal <#${selectedChannel}> e tente novamente.`,
        });
      }
    }
  );
};

export default registerTicketView;
