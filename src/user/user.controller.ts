import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { CurrencyService } from 'src/currency/currency.service'
import { ExchangeCurrency } from 'src/currency/dto/exchangeDto'

@Controller('user')
export class UserController {
  constructor(private currencyService: CurrencyService) {}

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
}
