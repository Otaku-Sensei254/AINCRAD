import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("organizations")
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private svc: OrganizationsService) {}
  @Get() list(@Request() req: any) {
    return this.svc.listForUser(req.user.id);
  }
  @Post() create(@Request() req: any, @Body() body: { name: string; tier?: string }) { return this.svc.create(req.user.id, body.name, body.tier); }
}
