import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server } from 'http'
import { Socket } from 'socket.io'
import {
  ON_EGG_PICK,
  ON_USER_JOIN,
  ON_USER_LEFT,
  ON_USER_MOVE,
  ON_USER_STOP,
} from './events'

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
    console.log('user joined')
    client.join(ROOM)
    // get all players
    const players = Object.values(this.connectedPlayers)
    this.connectedPlayers.set(client.id, player)

    // broadcast new user's arrival
    client.to(ROOM).emit(ON_USER_JOIN, player)
    return players
  }

  // handle user movement
  @SubscribeMessage(ON_USER_MOVE)
  handleUserMovement(@MessageBody() Player, @ConnectedSocket() client: Socket) {
    console.log('user moved')
    this.connectedPlayers.set(client.id, Player)
    client.to(ROOM).emit(ON_USER_MOVE, Player)
  }

  // handle user stop
  @SubscribeMessage(ON_USER_STOP)
  handleUserStop(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('user stopped')
    client.to(ROOM).emit(ON_USER_STOP, userId)
  }

  // handle user egg pick up
  handleEggPickUp(eggId: string) {
    this.server.emit(ON_EGG_PICK, eggId)
  }

  // handle user disconnection
  handleDisconnect(client: Socket) {
    console.log('user disconnected')
    const user = this.connectedPlayers.get(client.id)
    this.connectedPlayers.delete(client.id)
    if (user) {
      client.to(ROOM).emit(ON_USER_LEFT, user.game_id)
      console.log('disconnected', user.game_id)
    }
  }
}
