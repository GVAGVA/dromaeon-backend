import { Module } from '@nestjs/common'
import { EggService } from './egg.service'
import { CurrencyModule } from 'src/currency/currency.module'

@Module({
  providers: [EggService],
  imports: [CurrencyModule],
})
export class EggModule {}
