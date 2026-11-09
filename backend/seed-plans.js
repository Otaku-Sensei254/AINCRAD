const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const adapter = new PrismaPg({ host:"localhost", port:5432, database:"AINCRAD_DEV", user:"dtech", password:"Aincrad@18" });
const prisma = new PrismaClient({ adapter });
(async () => {
  const plans = [
    { name: "Free", tier: "FREE", amount: 0 },
    { name: "Pro", tier: "PRO", amount: 120000 },
    { name: "Team", tier: "TEAM", amount: 374100 },
  ];
  for (const p of plans) {
    await prisma.plan.upsert({ where: { tier: p.tier }, update: { amount: p.amount }, create: p });
  }
  console.log("seeded");
  await prisma.$disconnect();
})();
