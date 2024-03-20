import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { AddFaqItem } from './dto/addFaqDto'
import { UpdateFaqDto } from './dto/updateFaqDto'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // add faq item
  @Post('faq')
  @UseGuards(JwtAuthGuard)
  async addFaqItem(@Body() dto: AddFaqItem) {
    return await this.adminService.addFaqItem(dto)
  }

  // udpate faq item
  @Put('faq/:id')
  @UseGuards(JwtAuthGuard)
  async updateFaqItem(@Body() dto: UpdateFaqDto, @Param('id') id: string) {
    return await this.adminService.updateFaqItem(id, dto)
  }

  // get faq items
  @Get('faq')
  async getFaqs() {
    return await this.adminService.getFaqItems()
  }

  // delete faq items
  @Delete('faq/:id')
  @UseGuards(JwtAuthGuard)
  async deleteFaq(@Param('id') id: string) {
    return await this.adminService.deleteFaq(id)
  }
}
