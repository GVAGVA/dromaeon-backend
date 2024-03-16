import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'http'

const SOCKET_PORT = process.env.SOCKET_PORT
@WebSocketGateway({ namespace: '/chat', cors: '*:*', port: SOCKET_PORT })
export class ChatGateway {
  @WebSocketServer() server: Server

  @SubscribeMessage('test')
  testChatGateway(@MessageBody() message: string) {
    console.log(message)
  }
}
