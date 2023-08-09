import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [OtpController],
  providers: [OtpService, EmailService, WebhookService],
})
export class OtpModule {}
