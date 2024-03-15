import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { SocketModule } from 'src/socket/socket.module'

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  imports: [SocketModule],
})
export class ChatModule {}
