import { Injectable } from '@nestjs/common'
import { Currency } from '@prisma/client'
import { CurrencyService } from 'src/currency/currency.service'
import { EggService } from 'src/egg/egg.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private currencyService: CurrencyService,
    private eggService: EggService,
  ) {}

  async getNestsByUserId(userId: string) {
    const nests = await this.prisma.nest.findMany({
      where: { userId },
      include: { Egg: true },
    })

    return nests.map((item) => ({
      id: item.id,
      name: item.name,
      eggs: item.Egg.length,
    }))
  }

  async addNest(userId: string, name: string) {
    let price = 0
    const nests = await this.prisma.nest.findMany({ where: { userId } })

    if (nests.length) price = nests.length ** 2

    await this.currencyService.takeOutMoney(userId, 'SILVER', price)

    return await this.prisma.nest.create({
      data: { name, userId },
    })
  }

  async updateNest(id: string, name: string) {
    return await this.prisma.nest.update({ where: { id }, data: { name } })
  }

  async movetoNest(eggId: string, nestId: string) {
    return await this.prisma.egg.update({
      where: { id: eggId },
      data: { nestId },
    })
  }

  async cancelEggSale(eggId: string) {
    return await this.prisma.egg.update({
      where: { id: eggId },
      data: { is_for_sale: false },
    })
  }

  async throwEggFromInventory(userId: string, eggId: string) {
    const egg = await this.eggService.removeEgg(eggId)

    await this.currencyService.putMoney(userId, 'COPPER', 1)
    return egg
  }

  async getEggsByUserId(userId: string) {
    return await this.prisma.egg.findMany({ where: { userId } })
  }

  async getEggsByNestId(nestId: string) {
    return await this.prisma.egg.findMany({ where: { nestId } })
  }

  async getEggsForSaleByUserId(userId: string) {
    return await this.prisma.egg.findMany({
      where: { userId, is_for_sale: true },
    })
  }

  async getEggsWaitingByUserId(userId: string) {
    return await this.prisma.egg.findMany({ where: { userId, nest: null } })
  }
}
