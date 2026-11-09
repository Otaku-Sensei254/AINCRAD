import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async broadcast(subject: string, body: string) {
    return this.prisma.broadcast.create({ data: { subject, body } });
  }
  async listBroadcasts() { return this.prisma.broadcast.findMany({ orderBy: { createdAt: "desc" } }); }
  listAllOrgs() { return this.prisma.organization.findMany({ include: { projects: true } }); }
}
