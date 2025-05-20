import { slackClient } from "../utils/slackClient.mjs";
import { materialSuccessModal } from "../views/materialSuccessModal.mjs";

export async function handleMaterialRequest(payload) {
  const values = payload.view.state.values;
  const material = values.material_block.material_input.value;
  const quantity = values.quantity_block.quantity_input.value;
  const urgency = values.urgency_block.urgency_select.selected_option.value;
  const channel = process.env.MATERIALS_CHANNEL_ID;

  const urgencyText = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  }[urgency];

  await slackClient.chat.postMessage({
    channel,
    text: `:package: Nova solicitação de material\n*Material:* ${material}\n*Quantidade:* ${quantity}\n*Urgência:* ${urgencyText}`,
  });

  return materialSuccessModal(material, quantity, urgencyText);
}