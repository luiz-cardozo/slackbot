import { handleTicketSubmission } from "../services/ticketService.mjs";
import { handleMaterialRequest } from "../services/materialService.mjs";

export async function handleInteraction(req, res) {
  const payload = JSON.parse(req.body.payload);

  if (payload.type === "view_submission") {
    let view;

    switch (payload.view.callback_id) {
      case "ticket_submission":
        view = await handleTicketSubmission(payload);
        break;
      case "material_request":
        view = await handleMaterialRequest(payload);
        break;
      default:
        return res.status(200).send();
    }

    // ✅ Respondendo dentro de 3 segundos com o modal de sucesso
    return res.json({
      response_action: "update",
      view,
    });
  }

  return res.status(200).send();
}




