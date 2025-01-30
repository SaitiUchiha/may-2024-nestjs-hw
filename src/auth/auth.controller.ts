import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/auth.dto';
import { SingUpDto, UserDto } from '../user/dto/user.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({ type: SingUpDto })
  @Post('/signUp')
  create(@Body() body: UserDto) {
    return this.authService.signUpUser(body);
  }

  @Get('/list')
  findAll() {
    return this.authService.findAllAuth();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findAuthByID(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.updateAuth(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.removeAuth(id);
  }
}
