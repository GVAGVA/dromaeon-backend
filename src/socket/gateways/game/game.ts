import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'http'
import { Socket } from 'socket.io'
import { ON_EGG_PICK, ON_USER_JOIN, ON_USER_LEFT, ON_USER_MOVE } from './events'

export class Player {
  id: string
  game_id: string
  x: number
  y: number
}

const ROOM = 'explore'

@WebSocketGateway({ namespace: '/game', cors: '*:*' })
export class GameGateway {
  @WebSocketServer() server: Server

  private connectedPlayers = new Map<string, Player>()

  @SubscribeMessage(ON_USER_JOIN)
  testChatGateway(
    @MessageBody() player: Player,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(ROOM)
    // get all players
    const players = [...this.connectedPlayers.values()]
    this.connectedPlayers.set(client.id, player)

    // broadcast new user's arrival
    client.to(ROOM).emit(ON_USER_JOIN, player)
    return players
  }

  // handle user movement
  @SubscribeMessage(ON_USER_MOVE)
  handleUserMovement(@MessageBody() Player, @ConnectedSocket() client: Socket) {
    this.connectedPlayers.set(client.id, Player)
    client.to(ROOM).emit(ON_USER_MOVE, Player)
  }

  // handle user egg pick up
  @SubscribeMessage(ON_EGG_PICK)
  handleEggPickUp(
    @MessageBody() eggId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(ROOM).emit(ON_EGG_PICK, eggId)
  }

  // handle user disconnection
  handleDisconnect(client: Socket) {
    const user = this.connectedPlayers.get(client.id)
    this.connectedPlayers.delete(client.id)
    if (user) {
      client.to(ROOM).emit(ON_USER_LEFT, user.game_id)
    }
  }
}
