import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TrpcModule } from '@server/trpc/trpc.module';
import { UploadModule } from './upload/upload.module'; // Import the UploadModule
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TrpcModule,
    HttpModule,
    UploadModule, // Add the UploadModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
