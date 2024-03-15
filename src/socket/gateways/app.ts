import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ConnectedUserDto } from '../dto/connectedUserDto'

export const JOIN = 'JOIN'
export const GET_MESSAGE = 'GET_MESSAGE'
export const GET_NOTIFICATION = 'GET_NOTIFICATION'

@WebSocketGateway({ namespace: '/app', cors: '*:*' })
export class AppGateway {
  @WebSocketServer() server: Server

  private connectedUsers = new Map<string, Socket>()

  // handle user connection
  @SubscribeMessage(JOIN)
  handleJoinUser(
    @MessageBody() user: ConnectedUserDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('connected', user.game_id, this.connectedUsers.size)
    this.connectedUsers.set(user.id, client)
    return { message: 'connected to app events provider' }
  }

  // handle new message
  handleNewMessage({ userId, message }: { userId: string; message: any }) {
    const client = this.connectedUsers.get(userId)
    if (client && client.connected) {
      client.emit(GET_MESSAGE, message)
    }
  }
}
