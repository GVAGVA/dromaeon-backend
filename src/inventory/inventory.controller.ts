import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { Currency } from '@prisma/client'

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // get all nests for a logged in user
  @Get('nests')
  async getNestsForLoggedInUser(@Request() req) {
    return this.inventoryService
      .getNestsByUserId(req.user.id)
      .then((nests) => nests)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // create nest
  @Get('nest')
  async addNest(@Request() req, @Query('name') name: string) {
    return this.inventoryService
      .addNest(req.user.id, name)
      .then((nest) => nest)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // update nest using ID
  @Get('update/:id')
  async updateNest(@Param('id') id: string, @Query('name') name: string) {
    return this.inventoryService
      .updateNest(id, name)
      .then((nest) => nest)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // move an egg to other nest
  @Post('change-nest')
  async moveEgg(@Body() dto: { eggId: string; nestId: string }) {
    return this.inventoryService
      .movetoNest(dto.eggId, dto.nestId)
      .then((egg) => egg)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // move an egg to the market
  @Post('start-sale/:id')
  async startEggSale(
    @Param('id') id: string,
    @Body() dto: { currency: Currency; price: number },
  ) {
    return this.inventoryService
      .takeEggToMarket(id, dto.currency, dto.price)
      .then((egg) => egg)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // cancel egg sale
  @Get('cancel-sale/:id')
  async cancelSale(@Param('id') id: string) {
    return this.inventoryService
      .cancelEggSale(id)
      .then((egg) => egg)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // throw away egg
  @Get('reomve-egg/:id')
  async throwEgg(@Request() req, @Param('id') id: string) {
    return this.inventoryService.throwEggFromInventory(req.user.id, id)
  }

  // get eggs by user ID
  @Get('eggs')
  async getEggsByUserId(@Request() req) {
    return this.inventoryService
      .getEggsByUserId(req.user.id)
      .then((eggs) => eggs)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }
}
