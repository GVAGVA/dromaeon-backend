import { Currency } from '@prisma/client'

export interface EggTransactionDto {
  eggId: string
  from: string
  to: string
  currency: Currency
  amount: number
}
