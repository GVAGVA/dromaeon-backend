import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddFaqItem } from './dto/addFaqDto'
import { UpdateFaqDto } from './dto/updateFaqDto'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // faqs
  async addFaqItem(dto: AddFaqItem) {
    return await this.prisma.faq.create({ data: dto })
  }

  async updateFaqItem(id: string, dto: UpdateFaqDto) {
    return await this.prisma.faq.update({ where: { id }, data: dto })
  }

  async getFaqItems() {
    return await this.prisma.faq.findMany()
  }

  async deleteFaq(id: string) {
    return await this.prisma.faq.delete({ where: { id } })
  }
}
