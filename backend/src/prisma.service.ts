import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({ host: "localhost", port: 5432, database: "AINCRAD_DEV", user: "dtech", password: "Aincrad@18" });
    super({ adapter });
  }
  async onModuleInit() { await this.$connect(); }
}
