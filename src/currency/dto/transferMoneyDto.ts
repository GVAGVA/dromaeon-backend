import { Currency } from '@prisma/client'

export interface TransferMoneyDto {
  from: string
  to: string
  currency: Currency
  amount: number
}
