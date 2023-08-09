import { IsNumberString, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string; // User's email

  @IsNotEmpty()
  currentUrl: string;

  @IsNotEmpty()
  @IsNumberString()
  otp: string;
}
