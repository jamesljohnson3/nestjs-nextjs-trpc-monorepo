import { Module } from '@nestjs/common';
import { BucketController } from './bucket.controller';

@Module({
  controllers: [BucketController],
})
export class BucketModule {}
