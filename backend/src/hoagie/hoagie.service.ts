import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class HoagieService {
  constructor(
    @InjectModel('Hoagie') private hoagieModel: Model<any>,
    @InjectModel('Comment') private commentModel: Model<any>,
  ) {}

  create(createHoagieDto, userId: string) {
    const hoagie = new this.hoagieModel({
      ...createHoagieDto,
      creator: userId,
    });
    return hoagie.save();
  }

  async findAll(page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    const data = await this.hoagieModel.aggregate([
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'hoagie',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentsCount: { $size: '$comments' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $unwind: {
          path: '$creator',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          ingredients: 1,
          picture: 1,
          creator: { _id: 1, name: 1 },
          collaborators: 1,
          commentsCount: 1,
        },
      },
    ]);

    const total = await this.hoagieModel.countDocuments();

    return { data, total };
  }

  findOne(id: string) {
    return this.hoagieModel.findById(id).populate('creator').exec();
  }

  async addCollaborator(hoagieId: string, userId: string) {
    return this.hoagieModel.findByIdAndUpdate(
      hoagieId,
      { $addToSet: { collaborators: userId } },
      { new: true },
    );
  }

  async getHoagieDetails(hoagieId: string) {
    const hoagie = await this.hoagieModel
      .findById(hoagieId)
      .populate('creator', 'name email')
      .populate('collaborators', 'name email');

    const commentsCount = await this.commentModel.countDocuments({
      hoagie: hoagieId,
    });
    const collaboratorsCount = hoagie.collaborators.length;

    return { hoagie, commentsCount, collaboratorsCount };
  }
}
