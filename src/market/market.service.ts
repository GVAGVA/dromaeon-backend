import { Injectable, NotFoundException } from '@nestjs/common'
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
    return await this.prisma.egg.findMany({
      where: { is_for_sale: true },
      skip: pageSize * (page - 1),
      take: pageSize,
    })
  }

  // make egg transaction
  async eggTransaction({ eggId, to }: EggTransactionDto) {
    const egg = await this.prisma.egg.findUnique({ where: { id: eggId } })
    if (!egg) throw new NotFoundException()

    await this.currencyService.transferMooney({
      from: egg.userId,
      to,
      currency: egg.currency,
      amount: egg.price,
    })
    await this.eggService.updateEgg({ id: eggId, userId: to, nestId: null })
  }
}
