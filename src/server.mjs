import app from "./app.mjs";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`⚡️ Slack bot is running on port ${port}`);
});
