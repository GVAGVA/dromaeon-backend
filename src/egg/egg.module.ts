import { Module } from '@nestjs/common'
import { EggService } from './egg.service'
import { CurrencyModule } from 'src/currency/currency.module'
import { EggController } from './egg.controller';

@Module({
  providers: [EggService],
  imports: [CurrencyModule],
  controllers: [EggController],
})
export class EggModule {}
