import express, { type Request, type Response } from "express";
import cors from "cors";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/error.middleware.js";

// --- Route imports ---
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import aaRoutes from "./modules/aa/aa.routes.js";
import incomeRoutes from "./modules/income/income.routes.js";
import savingsRoutes from "./modules/savings/savings.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";
import interestRoutes from "./modules/interest/interest.routes.js";
import recommendationRoutes from "./modules/recommendations/recommendation.routes.js";
import taxRoutes from "./modules/tax/tax.routes.js";
import agentRoutes from "./agent/agent.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import simulationRoutes from "./modules/simulation/simulation.routes.js";

const app = express();

// --- Global middleware ---
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  logger.debug("HTTP", `${req.method} ${req.path}`);
  next();
});

// --- Health check (unauthenticated) ---
app.get("/health", (_req, res) =>
  res.json({
    status: "ok",
    service: "fintech-backend",
    timestamp: new Date().toISOString(),
  })
);

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/aa", aaRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/wallet", interestRoutes); // Interest routes nested under /api/wallet/:userId/interest
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/simulation", simulationRoutes);

// --- 404 handler for unknown routes ---
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: true,
    statusCode: 404,
    message: "Route not found",
  });
});

// --- Global error handler (must be last) ---
app.use(errorHandler);

export default app;