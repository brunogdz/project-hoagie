import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HoagieService } from './hoagie.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('hoagies')
export class HoagieController {
  constructor(private readonly hoagieService: HoagieService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createHoagieDto, @Request() req) {
    const userId = req.user._id || req.user.id;
    return this.hoagieService.create(createHoagieDto, userId);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.hoagieService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hoagieService.findOne(id);
  }
}
