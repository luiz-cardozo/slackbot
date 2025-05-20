import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

dotenv.config();

export const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
