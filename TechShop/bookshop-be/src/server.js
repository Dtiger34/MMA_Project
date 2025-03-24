import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
import connectDb from "./config/db.js";

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at: http://${HOSTNAME}:${PORT}`);
  connectDb();
});