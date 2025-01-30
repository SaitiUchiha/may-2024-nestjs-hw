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
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, PATH_TO_IMAGE } from '../common/utils/upload.utils';
import e from 'express';

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

  @Patch('/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: `.${PATH_TO_IMAGE}/avatar`,
        filename: editFileName,
      }),
    }),
  )
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000 }), // bytes
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadOneImgByID(id, file.filename);
  }

  @Patch('/gallery')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'imageLogo', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: `.${PATH_TO_IMAGE}/gallery`,
          filename: editFileName,
        }),
      },
    ),
  )
  uploadImg(
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000 }), // bytes
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    files: { image?: Express.Multer.File[]; imageLogo?: Express.Multer.File[] },
    @Body() body: any,
  ) {
    if (files?.image) {
      body.photo = `.${PATH_TO_IMAGE}/gallery/${files.image[0].filename}`;
    }
    if (files?.imageLogo) {
      body.logo = `.${PATH_TO_IMAGE}/gallery/${files.imageLogo[0].filename}`;
    }
    return this.userService.uploadManyImgByID(id, body);
  }

  @Patch('/gallery/delete')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'imageLogo', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: `.${PATH_TO_IMAGE}/gallery`,
          filename: editFileName,
        }),
      },
    ),
  )
  deleteImg(
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000000 }), // bytes
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    files: { image?: Express.Multer.File[]; imageLogo?: Express.Multer.File[] },
    @Body() body: any,
  ) {
    if (files?.image) {
      body.photo = `.${PATH_TO_IMAGE}/gallery/${files.image[0].filename}`;
    }
    if (files?.imageLogo) {
      body.logo = `.${PATH_TO_IMAGE}/gallery/${files.imageLogo[0].filename}`;
    }
    return this.userService.deleteImgByID(id, body);
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
