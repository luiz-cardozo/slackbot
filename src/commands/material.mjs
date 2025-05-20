import slackService from "../services/slackService.mjs";

export default async function material(req, res) {
  const { trigger_id } = req.body;
  try {
    const modal = slackService.buildMaterialModal();
    await slackService.openModal(trigger_id, modal);
    res.status(200).send();
  } catch (error) {
    console.error("Erro ao abrir o modal de material:", error);
    res.status(500).send("Erro interno");
  }
}
