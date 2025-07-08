export const getFormattedRequesterName = async (client, userId, logger) => {
  try {
    // Busca as informações do usuário usando a API do Slack
    const userInfo = await client.users.info({ user: userId });

    // Verifica se a chamada foi bem-sucedida e se o nome real existe
    if (userInfo.ok && userInfo.user.real_name) {
      // Retorna o nome formatado
      return `${userInfo.user.real_name} (<@${userId}>)`;
    }
  } catch (error) {
    // Em caso de erro, registra o log para depuração
    logger.error(`Erro ao buscar informações do usuário ${userId}:`, error);
  }

  // Se a busca falhar ou o nome não existir, retorna a menção como padrão
  return `<@${userId}>`;
};
