import { Injectable } from '@nestjs/common'
import { Currency } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { ExchangeCurrency } from './dto/exchangeDto'

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  public goldToCopper: number = 1000
  public silverToCopper: number = 100
  public goldToSilver: number = 10

  getCurrencyField(currency: Currency) {
    if (currency === 'GOLD') return 'gold'
    else if (currency === 'SILVER') return 'silver'
    else if (currency === 'COPPER') return 'copper'
  }

  calculateExchange({ fromCurrency, toCurrency, amount }: ExchangeCurrency) {
    if (fromCurrency === 'COPPER' && toCurrency === 'SILVER')
      return amount / this.silverToCopper
    else if (fromCurrency === 'COPPER' && toCurrency === 'GOLD')
      return amount / this.goldToCopper
    else if (fromCurrency === 'SILVER' && toCurrency === 'GOLD')
      return amount / this.goldToSilver
    else if (fromCurrency === 'SILVER' && toCurrency === 'COPPER')
      return amount * this.silverToCopper
    else if (fromCurrency === 'GOLD' && toCurrency === 'COPPER')
      return amount * this.goldToCopper
    else if (fromCurrency === 'GOLD' && toCurrency === 'SILVER')
      return amount * this.goldToSilver
  }

  async exchangeCurrency(
    userId: string,
    { fromCurrency, toCurrency, amount }: ExchangeCurrency,
  ) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        [this.getCurrencyField(fromCurrency)]: {
          decrement: Number(amount),
        },
        [this.getCurrencyField(toCurrency)]: {
          increment: this.calculateExchange({
            fromCurrency,
            toCurrency,
            amount,
          }),
        },
      },
    })
  }
}
