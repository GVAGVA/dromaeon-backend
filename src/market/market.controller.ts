import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { MarketService } from './market.service'
import { EggTransactionDto } from './dto/market.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'

@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Post('eggs')
  async getMarketEggs(@Body() dto: { page: number; pageSize: number }) {
    return await this.marketService
      .findAllForSale(dto)
      .then((eggs) => eggs)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  @Get('purchase/:id')
  @UseGuards(JwtAuthGuard)
  async purchaseEgg(@Request() req, @Param('id') id: string) {
    return await this.marketService.eggTransaction({
      to: req.user.id,
      eggId: id,
    })
  }

  @Post('trade')
  async makeEggTransaction(@Body() dto: EggTransactionDto) {
    return await this.marketService
      .eggTransaction(dto)
      .then(() => ({ message: 'success' }))
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }
}
