import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL || "postgresql://dtech:Aincrad@18@localhost:5432/AINCRAD_DEV";
    const adapter = new PrismaPg({ connectionString: url });
    super({ adapter });
  }
  async onModuleInit() { await this.$connect(); }
}
