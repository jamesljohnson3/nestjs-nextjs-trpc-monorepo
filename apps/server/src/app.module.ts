import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule from @nestjs/axios
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from '@server/trpc/trpc.module';

@Module({
  imports: [ConfigModule.forRoot(), TrpcModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
