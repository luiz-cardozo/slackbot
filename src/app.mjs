import express from "express";
import bodyParser from "body-parser";
import slackRoutes from "./routes/slack.mjs";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/slack", slackRoutes);

export default app;