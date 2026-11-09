import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const adapter = new PrismaPg({ host: "localhost", port: 5432, database: "AINCRAD_DEV", user: "dtech", password: "Aincrad@18" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "dhuhuinc@gmail.com" },
    update: {},
    create: { username: "admin", email: "dhuhuinc@gmail.com", password: hashed, role: "ADMIN" },
  });
  console.log("Admin seeded: dhuhuinc@gmail.com / Admin@123");
}

main().finally(() => prisma.$disconnect());
