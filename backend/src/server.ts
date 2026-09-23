import "dotenv/config";
import { env } from "./config/env.js";
import app from "./app.js";
import { pool, prisma } from "./db/client.js";
import { logger } from "./utils/logger.js";

const server = app.listen(env.PORT, () => {
  logger.info("Server", `Fintech backend listening on http://localhost:${env.PORT}`);
  logger.info("Server", `Environment: ${env.NODE_ENV}`);
});

async function shutdown() {
  logger.info("Server", "Shutting down gracefully...");
  server.close();
  await prisma.$disconnect();
  await pool.end();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);


