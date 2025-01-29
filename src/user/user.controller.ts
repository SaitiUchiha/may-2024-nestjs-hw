import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserItemDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../common/validators/base.query.validator';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/interface/response.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @Post('/create')
  createUser(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiPaginatedResponse('entities', UserItemDto)
  @Get('/list')
  findAll(@Query() query: BaseQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.userService.findByID(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
