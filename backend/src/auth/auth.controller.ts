import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) { return this.auth.register(dto); }

  @Post("login")
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Request() req: any) { return req.user; }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Get("users")
  async users() { return this.auth.listUsers(); }
}
