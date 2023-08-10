import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule from @nestjs/axios
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule], // Use HttpModule from @nestjs/axios
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
