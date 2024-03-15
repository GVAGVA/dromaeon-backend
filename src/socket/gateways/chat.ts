import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'http'

@WebSocketGateway({ namespace: '/chat', cors: '*:*' })
export class ChatGateway {
  @WebSocketServer() server: Server

  @SubscribeMessage('test')
  testChatGateway(@MessageBody() message: string) {
    console.log(message)
  }
}
