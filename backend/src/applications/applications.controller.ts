import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private svc: ApplicationsService) {}

  @Get() list(@Query("organizationId") orgId: string) { return this.svc.listForOrg(orgId); }
  @Get(":id") get(@Param("id") id: string) { return this.svc.get(id); }
  @Post() create(@Query("organizationId") orgId: string, @Body() body: any) { return this.svc.create(orgId, body); }
  @Put(":id") update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }
  @Delete(":id") remove(@Param("id") id: string) { return this.svc.remove(id); }
}
