// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // @ts-ignore
    url: process.env.DIRECT_URL, // Ganti sementara dari DATABASE_URL ke DIRECT_URL
  },
});