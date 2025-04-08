import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateCommentDto, @Request() req) {
    return this.commentService.create({ ...dto, user: req.user._id });
  }

  @Get('hoagie/:hoagieId')
  findByHoagie(@Param('hoagieId') hoagieId: string) {
    return this.commentService.findByHoagie(hoagieId);
  }
}
