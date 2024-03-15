import { Module } from '@nestjs/common'
import { ChatGateway } from './gateways/chat'
import { AppGateway } from './gateways/app'

@Module({
  providers: [AppGateway, ChatGateway],
  exports: [AppGateway, ChatGateway],
})
export class SocketModule {}
