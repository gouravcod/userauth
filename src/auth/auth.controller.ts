import { Body, Controller, Post, Get, Req, UseGuards, BadRequestException, Request, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {

    return await this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {

    try {
      return await this.authService.login(dto.email, dto.password);
    } catch (err) {
      return { error: err.message };
    }
  }


  @Get('getAllUsers')
  getUsers() {
    return {
        "message": "All Users",
        "users": this.authService.getUsers()
    };
}

@Get('getUserById')
getMany(@Query('ids') ids: string) {
  const idArray = ids
    .split(',')
    .map(id => parseInt(id))
    
  
  const tasks = this.authService.findManyByIds(idArray);

  return {
    message: 'Tasks fetched successfully',
    data: tasks,
  };
}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Req() req) {
    return {
      message: 'Dashboard Data',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return {
      message: 'Profile Data',
      user: req.user,
    };
  }

 
}
