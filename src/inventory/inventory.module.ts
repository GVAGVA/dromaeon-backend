import { Module } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { CurrencyModule } from 'src/currency/currency.module'
import { EggModule } from 'src/egg/egg.module'
import { UserModule } from 'src/user/user.module'
import { InventoryController } from './inventory.controller'
import { MarketModule } from 'src/market/market.module'

@Module({
  providers: [InventoryService],
  imports: [CurrencyModule, EggModule, UserModule, MarketModule],
  exports: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
