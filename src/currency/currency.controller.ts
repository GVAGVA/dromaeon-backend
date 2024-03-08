import { Body, Controller, Get, Post } from '@nestjs/common'
import { ExchangeCurrency } from './dto/exchangeDto'
import { CurrencyService } from './currency.service'

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Post('exchange')
  async exchange(@Body() dto: ExchangeCurrency) {
    return await this.currencyService.calculateExchange(dto)
  }
}
