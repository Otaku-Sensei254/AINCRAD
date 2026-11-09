import { Controller, Post, Get, Body, Headers, Req, Param } from "@nestjs/common";
import { BillingService } from "./billing.service";
import { PrismaService } from "../prisma.service";

@Controller("billing")
export class BillingController {
  constructor(private svc: BillingService, private prisma: PrismaService) {}
  @Post("initialize") init(@Body() body: { email: string; tier: string; callbackUrl: string }) {
    return this.svc.initialize(body.email, body.tier, body.callbackUrl);
  }
  @Post("webhook") async webhook(@Req() req: any, @Headers("x-paystack-signature") sig: string, @Body() body: any) {
    await this.svc.handleWebhook(body, sig);
    return { ok: true };
  }
  @Get("verify/:reference") async verify(@Param("reference") ref: string) {
    const data = await this.svc.verify(ref);
    if (data?.status === "success") {
      const tier = data.metadata?.tier;
      const email = data.customer?.email;
      if (tier && email) await this.prisma.user.updateMany({ where: { email }, data: { tier } });
    }
    return data;
  }
}
