import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Currency } from '@prisma/client'
import { CurrencyService } from 'src/currency/currency.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateEggDto } from './dto/updateEggDto'

@Injectable()
export class EggService {
  constructor(
    private prisma: PrismaService,
    private currencyService: CurrencyService,
  ) {}

  async updateEggPrice(eggid: string, price: number, currency: Currency) {
    await this.prisma.egg.update({
      where: { id: eggid },
      data: { price: Number(price), currency },
    })
  }

  async updateEgg({ id, ...egg }: UpdateEggDto) {
    try {
      await this.prisma.egg.update({
        where: { id: id },
        data: { ...egg },
      })
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async removeEgg(eggId: string) {
    return await this.prisma.egg.delete({ where: { id: eggId } })
  }
}
