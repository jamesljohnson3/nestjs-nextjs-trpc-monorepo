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
    return this.otpService.generateOtp(
      generateOtpDto,
      generateOtpDto.email,
      currentUrl,
    );
  }

  @Post('verify')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const currentUrl = '...'; // Set your current URL here
    return this.otpService.verifyOtp(verifyOtpDto, currentUrl);
  }

  @Post('resend-otp')
  async resendOtp(@Body() generateOtpDto: GenerateOtpDto) {
    const currentUrl = '...';
    const email = generateOtpDto.email;
    this.otpService.generateOtp(generateOtpDto, email, currentUrl);
    // Additional logic for resending OTP email if needed
  }
}
