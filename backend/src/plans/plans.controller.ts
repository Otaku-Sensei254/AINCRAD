import { Controller, Get, Put, Body, Param, UseGuards } from "@nestjs/common";
import { PlansService } from "./plans.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("plans")
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private svc: PlansService) {}
  @Get() list() { return this.svc.list(); }
  @Get(":tier") get(@Param("tier") t: string) { return this.svc.get(t); }
  @Put(":tier") update(@Param("tier") t: string, @Body() body: any) { return this.svc.update(t, body); }
}
