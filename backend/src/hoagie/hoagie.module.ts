import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HoagieController } from './hoagie.controller';
import { HoagieService } from './hoagie.service';
import { HoagieSchema } from './schemas/hoagie.schema';
import { CommentSchema } from '../comment/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Hoagie', schema: HoagieSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),
  ],
  controllers: [HoagieController],
  providers: [HoagieService],
  exports: [HoagieService],
})
export class HoagieModule {}
