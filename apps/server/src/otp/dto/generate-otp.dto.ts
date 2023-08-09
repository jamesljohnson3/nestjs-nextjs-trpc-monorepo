// src/otp/dto/generate-otp.dto.ts

import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  field1: string;
}
