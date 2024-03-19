import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ConnectedUserDto } from '../../dto/connectedUserDto'
import { Currency } from '@prisma/client'
import { GET_MESSAGE, JOIN, TRANSFER_MONEY } from './events'

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

  // handle money transfer
  handleMoneyTransfer({
    userId,
    currency,
    amount,
  }: {
    userId: string
    currency: Currency
    amount: number
  }) {
    const client = this.connectedUsers.get(userId)
    if (client && client.connected) {
      client.emit(TRANSFER_MONEY, { currency, amount })
    }
  }
}
