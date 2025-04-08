import { Schema, Types } from 'mongoose';

export const CommentSchema = new Schema(
  {
    text: { type: String, required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    hoagie: { type: Types.ObjectId, ref: 'Hoagie', required: true },
  },
  { timestamps: true },
);
