import { Module } from '@nestjs/common'
import { MarketService } from './market.service'
import { MarketController } from './market.controller'
import { CurrencyModule } from 'src/currency/currency.module'
import { EggModule } from 'src/egg/egg.module'
import { SocketModule } from 'src/socket/socket.module'

@Module({
  providers: [MarketService],
  controllers: [MarketController],
  imports: [CurrencyModule, EggModule, SocketModule],
  exports: [MarketService],
})
export class MarketModule {}
