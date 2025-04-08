import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentService {
  constructor(@InjectModel('Comment') private commentModel: Model<any>) {}

  create(createCommentDto) {
    const comment = new this.commentModel(createCommentDto);
    return comment.save();
  }

  findByHoagie(hoagieId: string) {
    return this.commentModel.find({ hoagie: hoagieId }).populate('user').exec();
  }
}
