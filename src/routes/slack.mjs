import express from "express";
import commandHandlers from "../commands/index.mjs";
import { handleInteraction } from "../handlers/interactions.mjs";

const router = express.Router();

router.post("/commands", async (req, res) => {
  const { command } = req.body;
  const commandName = command.replace("/", "").trim();

  if (commandHandlers[commandName]) {
    await commandHandlers[commandName](req, res);
  } else {
    res.status(404).send("Comando não encontrado");
  }
});

router.post("/interactions", handleInteraction);

export default router;