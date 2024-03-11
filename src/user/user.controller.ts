import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { CurrencyService } from 'src/currency/currency.service'
import { ExchangeCurrency } from 'src/currency/dto/exchangeDto'
import { UserService } from './user.service'
import { InventoryService } from 'src/inventory/inventory.service'

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

  @Get('profiles')
  async searchProfiles(
    @Query('search') search: string,
    @Query('page') page: number,
  ) {
    return this.userService.searchProfiles(Number(page), search)
  }

  @Get('currency')
  @UseGuards(JwtAuthGuard)
  async getUserMoney(@Request() req) {
    return this.currencyService.getUserMoney(req.user.id)
  }
}
