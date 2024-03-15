import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddMessageDto, SendMessageDto } from './types/addMessageDto'
import { AppGateway } from 'src/socket/gateways/app'
import { Message } from '@prisma/client'
import { chatRoomSelection } from './chat.selection'

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appGateway: AppGateway,
  ) {}

  // send message
  async sendMessage(dto: SendMessageDto) {
    const userChatRoom = await this.prisma.userChatRoom.findFirst({
      where: {
        userId: dto.from,
        chatRoom: { isPrivate: true, participants: { some: { id: dto.to } } },
      },
      select: { chatRoom: { select: { id: true } } },
    })

    if (!userChatRoom) {
      const chatRoom = await this.addChatRoom(dto)
      return await this.addMessage({
        userId: dto.from,
        chatRoomId: chatRoom.id,
        content: dto.content,
      })
    }

    return await this.addMessage({
      userId: dto.from,
      chatRoomId: userChatRoom.chatRoom.id,
      content: dto.content,
    })
  }

  // add message
  async addMessage(dto: AddMessageDto) {
    await this.prisma.userChatRoom.updateMany({
      where: { chatRoomId: dto.chatRoomId },
      data: { visibility: true },
    })

    const message = await this.prisma.message.create({
      data: {
        userId: dto.userId,
        chatRoomId: dto.chatRoomId,
        content: dto.content,
      },
    })
    // send new message event to the user
    this.sendNewMessageEvent(message)

    return message
  }

  // add chat room
  async addChatRoom(dto: SendMessageDto) {
    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        name: `${dto.from}-${dto.to}`,
        isPrivate: true,
      },
    })

    await this.prisma.userChatRoom.createMany({
      data: [
        { userId: dto.from, chatRoomId: chatRoom.id },
        { userId: dto.to, chatRoomId: chatRoom.id },
      ],
    })

    return chatRoom
  }

  // get a chatroom
  async getChatRoomById(userId: string, roomId: string) {
    const data = await this.prisma.userChatRoom.findFirst({
      where: { chatRoomId: roomId },
      include: {
        chatRoom: {
          select: {
            id: true,
            updatedAt: true,
            name: true,
            participants: { select: { id: true, avatar: true, game_id: true } },
            UserChatRoom: {
              where: { userId: { not: userId } },
              select: {
                user: { select: { id: true, game_id: true, avatar: true } },
              },
            },
            messages: {
              select: {
                content: true,
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    })

    return {
      id: data.id,
      chatRoomId: data.chatRoomId,
      updatedAt: data.chatRoom.updatedAt,
      user: data.chatRoom.UserChatRoom[0].user,
      lastMessage: data.chatRoom.messages[0].content,
    }
  }

  // get all chatroom
  async getAllUserChatRooms(userId: string) {
    const data = await this.prisma.userChatRoom.findMany({
      where: { userId, visibility: true },
      include: {
        chatRoom: {
          select: {
            id: true,
            updatedAt: true,
            name: true,
            participants: { select: { id: true, avatar: true, game_id: true } },
            UserChatRoom: {
              where: { userId: { not: userId } },
              select: {
                user: { select: { id: true, game_id: true, avatar: true } },
              },
            },
            messages: {
              select: {
                content: true,
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        chatRoom: {
          updatedAt: 'desc',
        },
      },
    })

    return data.map((item) => ({
      id: item.id,
      chatRoomId: item.chatRoomId,
      updatedAt: item.chatRoom.updatedAt,
      user: item.chatRoom.UserChatRoom[0].user,
      lastMessage: item.chatRoom.messages[0].content,
    }))
  }

  // get all messages in the server
  async getAllMessagesByRoomId(roomId: string) {
    const messages = await this.prisma.message.findMany({
      where: { chatRoomId: roomId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return messages.reverse()
  }

  // send new message event
  async sendNewMessageEvent(message: Message) {
    const users = await this.prisma.user.findMany({
      where: {
        id: { not: message.userId },
        UserChatRoom: { some: { chatRoom: { id: message.chatRoomId } } },
      },
    })
    users.forEach((item) => {
      this.appGateway.handleNewMessage({ userId: item.id, message })
    })
  }

  // hide chat room
  async hideUserChatRoom(roomId: string) {
    return await this.prisma.userChatRoom.updateMany({
      where: { chatRoomId: roomId },
      data: { visibility: false },
    })
  }

  // open chat room
  async openUserChatRoom(roomId: string) {
    return await this.prisma.userChatRoom.updateMany({
      where: { chatRoomId: roomId },
      data: { visibility: true },
    })
  }
}
