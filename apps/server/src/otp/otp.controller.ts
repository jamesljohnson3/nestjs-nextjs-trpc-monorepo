import { Controller, Post, Body, Req } from '@nestjs/common';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  async generateOtp(
    @Body() generateOtpDto: GenerateOtpDto,
    @Req() request: any,
  ) {
    const currentUrl = request.headers.referer || '';
    const otpCode = await this.otpService.generateAndSendOtp(
      generateOtpDto.email,
      currentUrl,
    );

    return { otpCode }; // Return the generated OTP code if needed
  }

  @Post('verify')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Req() request: any) {
    const currentUrl = request.headers.referer || '';

    const verificationResult = await this.otpService.verifyOtp(
      verifyOtpDto,
      currentUrl,
    );

    if (verificationResult.isValid) {
      // Your logic for handling successful verification
      return { success: true, message: verificationResult.message };
    } else {
      // Your logic for handling failed verification
      return { success: false, message: verificationResult.message };
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body() generateOtpDto: GenerateOtpDto, @Req() request: any) {
    const currentUrl = request.headers.referer || '';

    try {
      const otpCode = await this.otpService.generateAndSendOtp(
        generateOtpDto.email,
        currentUrl,
      );

      // Your additional logic for resending OTP email if needed

      return { otpCode }; // Return the new OTP code if needed
    } catch (error) {
      // Handle error if OTP generation or email sending fails
      return { message: 'Error resending OTP' };
    }
  }
}
