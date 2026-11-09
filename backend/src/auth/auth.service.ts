import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { username: dto.username }] } });
    if (exists) throw new ConflictException("User already exists");
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { username: dto.username, email: dto.email, password: hashed } });
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const token = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    return { access_token: token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  }

  async listUsers() { return this.prisma.user.findMany({ select: { id: true, username: true, email: true, role: true, createdAt: true } }); }

  async validateUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
