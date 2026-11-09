import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("admin")
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private svc: AdminService) {}
  @Post("broadcast") create(@Body() body: { subject: string; body: string }) { return this.svc.broadcast(body.subject, body.body); }
  @Get("broadcasts") list() { return this.svc.listBroadcasts(); }
  @Get("organizations") listOrgs() { return this.svc.listAllOrgs(); }
}
