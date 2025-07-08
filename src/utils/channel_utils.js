export const findChannelsEndingWith = async (client, searchTerm, logger) => {
  try {
    // Busca a lista de canais públicos
    const result = await client.conversations.list({
      types: 'public_channel',
    });

    // Filtra os canais usando o searchTerm e formata para o seletor do Slack
    const filteredChannels = result.channels
      .filter((channel) => channel.name.endsWith(searchTerm))
      .map((channel) => ({
        text: { type: 'plain_text', text: `#${channel.name}` },
        value: channel.id,
      }));

    return filteredChannels;
  } catch (error) {
    logger.error('Erro ao buscar a lista de canais:', error);
    // Retorna um array vazio em caso de erro para não quebrar o modal
    return [];
  }
};
