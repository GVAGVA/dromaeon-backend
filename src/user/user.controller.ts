import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { CurrencyService } from 'src/currency/currency.service'
import { ExchangeCurrency } from 'src/currency/dto/exchangeDto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(
    private currencyService: CurrencyService,
    private userService: UserService,
  ) {}

  @Post('exchange-currency')
  @UseGuards(JwtAuthGuard)
  async exchangeCurrency(@Request() req, @Body() dto: ExchangeCurrency) {
    return this.currencyService
      .exchangeCurrency(req.user.id, dto)
      .then((data) => data)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return await this.userService.findOneById(id)
  }

  @Get('private-chat/:id')
  @UseGuards(JwtAuthGuard)
  async getConnectedPrivateChatServer(@Param('id') id: string, @Request() req) {
    return await this.userService.connectedChatServer(id, req.user.id)
  }

  @Get('check-username/:username')
  @UseGuards(JwtAuthGuard)
  async checkUsername(@Request() req, @Param('username') username: string) {
    return await this.userService.checkUsernameUnique(username, req.user.id)
  }

  @Get('profiles')
  async searchProfiles(
    @Query('search') search: string,
    @Query('page') page: number,
  ) {
    return this.userService.searchProfiles(Number(page), search)
  }

  @Get('profiles-cons')
  @UseGuards(JwtAuthGuard)
  async searchProfilesWithCons(
    @Query('search') search: string,
    @Query('page') page: number,
    @Request() req,
  ) {
    return this.userService.searchProfilesWithCons(
      Number(page),
      search,
      req.user.id,
    )
  }

  @Get('currency')
  @UseGuards(JwtAuthGuard)
  async getUserMoney(@Request() req) {
    return this.currencyService.getUserMoney(req.user.id)
  }
}
