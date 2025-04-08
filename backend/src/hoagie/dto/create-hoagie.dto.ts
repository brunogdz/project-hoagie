import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';

export class CreateHoagieDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  ingredients: string[];

  @IsOptional()
  @IsString()
  picture?: string;

  @IsMongoId()
  creator: string;
}
