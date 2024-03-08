import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { CurrencyModule } from 'src/currency/currency.module'

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
  imports: [CurrencyModule],
})
export class UserModule {}
