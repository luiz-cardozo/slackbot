import slackService from "../services/slackService.mjs";

export default async function ticket(req, res) {
  const { trigger_id } = req.body;
  try {
    const channels = await slackService.getTicketChannels();
    const modal = slackService.buildTicketModal(channels, req.body.response_url);
    await slackService.openModal(trigger_id, modal);
    res.status(200).send();
  } catch (error) {
    console.error("Erro ao abrir o modal de ticket:", error);
    res.status(500).send("Erro interno");
  }
}
