import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { EggService } from './egg.service'
import { Currency, Egg } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'

@Controller('egg')
export class EggController {
  constructor(private eggService: EggService) {}

  // fetch eggs uncovered for explorer map
  @Get('uncovered')
  async getEggsUncovered() {
    return await this.eggService
      .getEggsUncovered()
      .then((eggs) => eggs)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // create bulk eggs
  @Post('bulk')
  async createEggs(@Body() dto: Egg[]) {
    return await this.eggService
      .createEggs(dto)
      .then((eggs) => eggs)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // pick up an egg
  @Post('pick-up')
  @UseGuards(JwtAuthGuard)
  async pickUpEgg(
    @Request() req,
    @Body() dto: { eggId: string; nestId: string },
  ) {
    return await this.eggService
      .pickUpEgg(req.user.id, dto.eggId, dto.nestId)
      .then((egg) => egg)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // change egg price
  @Post('price/:id')
  @UseGuards(JwtAuthGuard)
  async changeEggPrice(
    @Param('id') id: string,
    @Body() dto: { price: number; currency: Currency },
  ) {
    return await this.eggService
      .updateEggPrice(id, Number(dto.price), dto.currency)
      .then((egg) => egg)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // remove egg
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeEgg(@Param('id') id: string) {
    return await this.eggService.removeEgg(id)
  }
}
