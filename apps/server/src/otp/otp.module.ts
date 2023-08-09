import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule

@Module({
  providers: [OtpService, EmailService], // Include WebhookService in providers
  imports: [HttpModule], // Add HttpModule to imports
})
export class OtpModule {}
