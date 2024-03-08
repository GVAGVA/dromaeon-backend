import { Body, Controller, Get, Post } from '@nestjs/common'
import { ExchangeCurrency } from './dto/exchangeDto'
import { CurrencyService } from './currency.service'
import { TransferMoneyDto } from './dto/transferMoneyDto'

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Post('exchange')
  async exchange(@Body() dto: ExchangeCurrency) {
    return await this.currencyService.calculateExchange(dto)
  }

  @Post('transfer')
  async transferMoney(@Body() dto: TransferMoneyDto) {
    return await this.currencyService.transferMooney(dto)
  }
}
