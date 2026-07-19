import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";

const app: Application = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Welcome to the RentNest API 🏠" });
});

app.use("/api/auth", authRoutes);

export default app;
