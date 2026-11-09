import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import crypto from "crypto";

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async initialize(email: string, tier: string, callbackUrl: string) {
    const plan = await this.prisma.plan.findUnique({ where: { tier } });
    if (!plan || !plan.active) throw new Error("Unknown or inactive tier");
    const amount = plan.amount;
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, amount, callback_url: callbackUrl, metadata: { tier } }),
    });
    const data: any = await res.json();
    return data.data;
  }

  async verify(reference: string) {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
    const data: any = await res.json();
    return data.data;
  }

  async handleWebhook(body: any, signature: string) {
    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "").update(JSON.stringify(body)).digest("hex");
    if (hash !== signature) return;
    if (body.event === "charge.success") {
      const tier = body.data?.metadata?.tier;
      const email = body.data?.customer?.email;
      if (tier && email) {
        await this.prisma.user.updateMany({ where: { email }, data: { tier } });
      }
    }
  }
}
