import {
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from './guards/jwt.guard'
import { UserService } from 'src/user/user.service'

const redirectUrl = process.env.FRONT_APP_URL || ''

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private userService: UserService,
  ) {}

  @Get('test')
  async hello() {
    return 'Welcome to Dromaeon!'
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async login(@Req() req) {}

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  async steamLogin(@Req() req) {}

  @Get('d-redirect')
  @UseGuards(AuthGuard('discord'))
  @Redirect(redirectUrl, 301)
  async callback(@Query('code') code: string, @Request() req) {
    return { url: `${this.config.get('FRONT_APP_URL')}?token=${req.user}` }
  }

  @Get('s-redirect')
  @UseGuards(AuthGuard('steam'))
  @Redirect(redirectUrl, 301)
  async steamRedirect(@Request() req) {
    return { url: `${this.config.get('FRONT_APP_URL')}?token=${req.user}` }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return await this.userService.findOneById(req.user.id)
  }

  @Get('connect/:id')
  @UseGuards(JwtAuthGuard)
  async connectProfile(@Param('id') id: string) {}
}
