import { Injectable } from '@nestjs/common'
import { CurrencyService } from 'src/currency/currency.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EggTransactionDto } from './dto/market.dto'
import { EggService } from 'src/egg/egg.service'

@Injectable()
export class MarketService {
  constructor(
    private prisma: PrismaService,
    private currencyService: CurrencyService,
    private eggService: EggService,
  ) {}

  // get eggs in market
  async findAllForSale({ page, pageSize }: { page: number; pageSize: number }) {
    await this.prisma.egg.findMany({
      where: { is_for_sale: true },
      skip: pageSize * (page - 1),
      take: pageSize,
    })
  }

  // make egg transaction
  async eggTransaction({
    from,
    to,
    currency,
    amount,
    eggId,
  }: EggTransactionDto) {
    await this.currencyService.transferMooney({ from, to, currency, amount })
    await this.eggService.updateEgg({ id: eggId, userId: to, nestId: null })
  }
}
