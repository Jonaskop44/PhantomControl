declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_REFRESH_TOKEN: string;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SECRET_KEY: string;
  }
}
