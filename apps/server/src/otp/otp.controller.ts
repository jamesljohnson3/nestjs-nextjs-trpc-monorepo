// src/otp/otp.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  generateOtp(@Body() generateOtpDto: GenerateOtpDto) {
    return this.otpService.generateOtp(generateOtpDto.email);
  }
}