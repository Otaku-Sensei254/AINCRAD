import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.plan.findMany({ orderBy: { amount: "asc" } }); }
  get(tier: string) { return this.prisma.plan.findUnique({ where: { tier } }); }
  update(tier: string, data: any) { return this.prisma.plan.update({ where: { tier }, data }); }
}
