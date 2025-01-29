import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  Query,
  HttpStatus, UseGuards, Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto, UserItemDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { BaseQueryDto } from '../common/validators/base.query.validator';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/interface/response.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';


@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: UserDto })
  @Post('/create')
  createUser(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('Admin') //тут перечисляють ролі які можуть бачити список юзерів. (Бажано виносити в Enum)
  @UseGuards(AuthGuard(), RoleGuard)
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
  // @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
