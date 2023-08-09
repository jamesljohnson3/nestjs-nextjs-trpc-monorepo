import { Controller, Post, Body, Req } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  generateOtp(@Body() generateOtpDto: GenerateOtpDto, @Req() request: any) {
    const currentUrl = request.headers.referer || '';
    return this.otpService.generateAndSendOtp(generateOtpDto.email, currentUrl);
  }

  @Post('verify')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const currentUrl = ''; // Set the current URL here
    return this.otpService.verifyOtp(verifyOtpDto, currentUrl);
  }

  @Post('resend-otp')
  async resendOtp(@Body() generateOtpDto: GenerateOtpDto) {
    const currentUrl = ''; // Set the current URL here
    const email = generateOtpDto.email;
    const otpCode = this.otpService.generateAndSendOtp(email, currentUrl);
    // Additional logic for resending OTP email if needed
  }
}
