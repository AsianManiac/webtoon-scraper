import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import morgan from "morgan";
import { initializeApp } from "./app";
import { setupCronJob } from "./crons/dailyToonCron";
import { logger } from "./logger";
import { errorHandler } from "./middlewares/errorHandler";
import useRoutes from "./routes";
import { db } from "./utils/prisma";

const PORT = process.env.PORT || 4000;
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));
app.use(errorHandler);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://main.d14c59yxo4ca7r.amplifyapp.com",
      "https://electrofix-pro.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

useRoutes(app);
initializeApp(app);
setupCronJob();

async function main() {
  await db.$connect();
  logger.info("Starting the scraping process...");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
