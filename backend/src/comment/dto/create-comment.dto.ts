import { IsString, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsMongoId()
  user: string;

  @IsMongoId()
  hoagie: string;
}
