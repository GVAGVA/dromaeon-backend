import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { EggService } from './egg.service'
import { Currency } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'

@Controller('egg')
export class EggController {
  constructor(private eggService: EggService) {}

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
