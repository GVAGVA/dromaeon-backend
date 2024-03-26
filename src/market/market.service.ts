import { Injectable, NotFoundException } from '@nestjs/common'
import { CurrencyService } from 'src/currency/currency.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { EggTransactionDto } from './dto/market.dto'
import { EggService } from 'src/egg/egg.service'
import { Observable, Subject } from 'rxjs'
import { MarketEventDto } from './dto/market-event.dto'
import { Currency } from '@prisma/client'
import { AppGateway } from 'src/socket/gateways/app/app'

@Injectable()
export class MarketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyService: CurrencyService,
    private readonly eggService: EggService,
    private readonly appEvent: AppGateway,
  ) {}

  // market event
  private marketEvents = new Subject<MarketEventDto>()

  // send real-time event
  async sendEvent(event: MarketEventDto) {
    this.marketEvents.next(event)
  }

  // marketevent getter
  getMarketEventsObservable(): Observable<MarketEventDto> {
    return this.marketEvents.asObservable()
  }

  // get eggs in market
  async findAllForSale({ page, pageSize }: { page: number; pageSize: number }) {
    return await this.prisma.egg.findMany({
      where: { is_for_sale: true },
      skip: pageSize * (page - 1),
      take: pageSize,
    })
  }

  // add egg to market
  async takeEggToMarket(eggId: string, currency: Currency, price: number) {
    const egg = await this.prisma.egg.update({
      where: { id: eggId },
      data: {
        is_for_sale: true,
        price,
        currency,
      },
    })

    // send add event to market
    this.sendEvent({ type: 'ADDED', data: { egg } })

    return egg
  }

  // remove egg from market
  async removeEggFromMarket(eggId: string) {
    const updated = await this.prisma.egg.update({
      where: { id: eggId },
      data: { is_for_sale: false },
    })

    // send remove event to market
    this.sendEvent({ type: 'PURCHASED', data: { egg: updated } })

    return updated
  }

  // make egg transaction
  async eggTransaction({ eggId, to }: EggTransactionDto) {
    const egg = await this.prisma.egg.findUnique({ where: { id: eggId } })
    if (!egg) throw new NotFoundException()

    await this.currencyService.transferMooney({
      from: to,
      to: egg.userId,
      currency: egg.currency,
      amount: egg.price,
    })
    await this.eggService.updateEgg({
      id: eggId,
      userId: to,
      nestId: null,
      is_for_sale: false,
    })

    this.appEvent.handleMoneyTransfer({
      userId: egg.userId,
      currency: egg.currency,
      amount: egg.price,
    })
  }
}
