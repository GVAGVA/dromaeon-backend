import { Currency } from '@prisma/client'

export interface ExchangeCurrency {
  fromCurrency: Currency
  toCurrency: Currency
  amount: number
}
