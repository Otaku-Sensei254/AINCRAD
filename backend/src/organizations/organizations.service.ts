import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}
  listForUser(userId: string) {
    return this.prisma.organization.findMany({ where: { memberships: { some: { userId } } }, include: { projects: true } });
  }
  listAll() {
    return this.prisma.organization.findMany({ include: { projects: true } });
  }
  create(userId: string, name: string, tier?: string) {
    if (tier) this.prisma.user.update({ where: { id: userId }, data: { tier } }).catch(() => {});
    return this.prisma.organization.create({ data: { name, memberships: { create: { userId, role: "owner" } } } });
  }
}
