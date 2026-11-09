import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

const TIER_LIMITS: Record<string, number> = { FREE: 5, PRO: 50, TEAM: Infinity };

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async listForOrg(orgId: string) {
    return this.prisma.application.findMany({ where: { project: { organizationId: orgId } }, include: { environments: true } });
  }

  async get(id: string) {
    return this.prisma.application.findUnique({ where: { id }, include: { environments: true } });
  }

  async create(orgId: string, data: any) {
    const org = await this.prisma.organization.findUnique({ where: { id: orgId }, include: { memberships: { include: { user: true } } } });
    const tier = org?.memberships?.map((m) => m.user.tier).sort().pop() ?? "FREE";
    const limit = TIER_LIMITS[tier] ?? 5;
    const count = await this.prisma.application.count({ where: { project: { organizationId: orgId } } });
    if (count >= limit) throw new ForbiddenException(`Tier ${tier} limit reached (${limit} apps). Upgrade to add more.`);
    let project = await this.prisma.project.findFirst({ where: { organizationId: orgId } });
    if (!project) project = await this.prisma.project.create({ data: { name: "Default", organizationId: orgId } });
    return this.prisma.application.create({ data: { name: data.name, type: data.type || "WEB", url: data.url, healthPath: data.healthPath, command: data.command, logPath: data.logPath, projectId: project.id } });
  }

  async update(id: string, data: any) {
    const { name, type, url, healthPath, command, logPath, paused } = data;
    return this.prisma.application.update({ where: { id }, data: { name, type, url, healthPath, command, logPath, paused } });
  }

  async remove(id: string) {
    return this.prisma.application.delete({ where: { id } });
  }
}
