import slackService from "../services/slackService.mjs";

export default async function support(req, res) {
  const { trigger_id } = req.body;
  try {
    const modal = slackService.buildSupportModal();
    await slackService.openModal(trigger_id, modal);
    res.status(200).send();
  } catch (error) {
    console.error("Erro ao abrir o modal de suporte:", error);
    res.status(500).send("Erro interno");
  }
}
