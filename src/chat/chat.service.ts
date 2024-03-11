import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddMessageDto, SendMessageDto } from './types/addMessageDto'

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

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

    await this.prisma.chatRoom.update({
      where: { id: dto.chatRoomId },
      data: { lastMessage: dto.content },
    })

    return await this.prisma.message.create({
      data: {
        userId: dto.userId,
        chatRoomId: dto.chatRoomId,
        content: dto.content,
      },
    })
  }

  // add chat room
  async addChatRoom(dto: SendMessageDto) {
    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        name: `${dto.from}-${dto.to}`,
        lastMessage: dto.content,
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

  // hide chat room
  async hideUserChatRoom(roomId: string) {
    return await this.prisma.userChatRoom.update({
      where: { id: roomId },
      data: { visibility: false },
    })
  }

  // get all servers
  async getAllUserChatRooms(userId: string) {
    const data = await this.prisma.userChatRoom.findMany({
      where: { userId, visibility: true },
      include: {
        chatRoom: {
          select: {
            id: true,
            updatedAt: true,
            name: true,
            lastMessage: true,
            participants: { select: { id: true, avatar: true, game_id: true } },
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
      users: item.chatRoom.participants,
      lastMessage: item.chatRoom.lastMessage,
    }))
  }

  // get all messages in the server
  async getAllMessages(roomId: string) {
    return await this.prisma.message.findMany({
      where: { chatRoomId: roomId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })
  }
}
