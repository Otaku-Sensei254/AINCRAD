import { IsEmail, IsString, MinLength, Matches } from "class-validator";
export class RegisterDto {
  @IsString() username: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/, { message: "Password must contain uppercase, number and special char" }) password: string;
}
