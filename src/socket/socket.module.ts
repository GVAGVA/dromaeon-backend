import { Module } from '@nestjs/common'
import { ChatGateway } from './gateways/chat'
import { AppGateway } from './gateways/app'
import { GameGateway } from './gateways/game/game'

@Module({
  providers: [AppGateway, ChatGateway, GameGateway],
  exports: [AppGateway, ChatGateway, GameGateway],
})
export class SocketModule {}
