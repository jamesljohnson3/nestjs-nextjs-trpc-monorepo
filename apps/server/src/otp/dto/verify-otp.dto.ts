import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string; // User's email

  @IsString()
  @IsNotEmpty()
  otp: string; // OTP code
}
