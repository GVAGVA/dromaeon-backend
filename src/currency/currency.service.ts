import { BadRequestException, Injectable } from '@nestjs/common'
import { Currency } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { ExchangeCurrency } from './dto/exchangeDto'
import { TransferMoneyDto } from './dto/transferMoneyDto'

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

  // exchange currencies
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
      select: { copper: true, silver: true, gold: true },
    })
  }

  // transfer money between two users
  async transferMooney({ from, to, currency, amount }: TransferMoneyDto) {
    // take out money from one acc
    await this.takeOutMoney(from, currency, amount)
    // put money to other's acc
    await this.putMoney(to, currency, amount)
  }

  // give money to a user's acc
  async putMoney(userId: string, currency: Currency, amount: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        [this.getCurrencyField(currency)]: { increment: Number(amount) },
      },
    })
  }

  // take out money from a user's acc
  async takeOutMoney(userId: string, currency: Currency, amount: number) {
    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
          [this.getCurrencyField(currency)]: { gte: Number(amount) },
        },
        data: {
          [this.getCurrencyField(currency)]: { decrement: Number(amount) },
        },
      })
    } catch (err) {
      throw new BadRequestException(`${currency} isn't enought!`)
    }
  }

  // get user's money
  async getUserMoney(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: { copper: true, silver: true, gold: true },
    })
  }
}
