import { Schema, Types } from 'mongoose';

export const HoagieSchema = new Schema(
  {
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    picture: { type: String, required: false },
    creator: { type: Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);
