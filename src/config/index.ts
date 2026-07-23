import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  databaseUrl: process.env.DATABASE_URL || "",

  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",

  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
};
