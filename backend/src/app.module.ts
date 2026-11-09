import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { ApplicationsModule } from "./applications/applications.module";
import { BillingModule } from "./billing/billing.module";
import { PlansModule } from "./plans/plans.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [AuthModule, OrganizationsModule, ApplicationsModule, BillingModule, PlansModule, AdminModule],
})
export class AppModule {}
