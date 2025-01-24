import dotenv from "dotenv";

dotenv.config();

const config = {
  APP: {
    FRONTEND_URL:
      process.env.FRONTEND_URL ?? "https://main.d14c59yxo4ca7r.amplifyapp.com",
    APP_PORT: process.env.PORT ?? 4200,
    APP_NAME: process.env.APP_NAME ?? "Bun App",
    APP_VERSION: process.env.APP_VERSION ?? "1.0.0",
    APP_URL: process.env.APP_URL ?? `http://127.0.0.1`,
    NODE_ENV: process.env.NODE_ENV ?? "production",
  },
  GMAIL: {
    EMAIL_USER: "tgearaccessories@gmail.com",
    EMAIL_PASS: "kffzzvthehivjupv",
    FROM_EMAIL: "junjotay@gmail.com",
  },
  USE_DB_QUEUE: true,
};

export default config;
