import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  providers: [MarketService],
  controllers: [MarketController],
  imports: [CurrencyModule]
})
export class MarketModule {}
