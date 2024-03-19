import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client'
import { UpdateUserDto } from './dto/updateUserDto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private pageSize: number = 4

  // find user by game_id
  async findOne(gameId: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { game_id: gameId } })
  }

  // find user by id
  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { Egg: true },
    })
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  // connect accounts from discord to steam and vice versa
  async connectAccount(original: string, newAccount: string) {
    const originalAcc = await this.prisma.user.findUnique({
      where: { id: original },
    })
    if (!originalAcc) return { message: 'failed' }

    const deleted = await this.prisma.user.delete({ where: { id: newAccount } })

    if (!originalAcc.discord_id) {
      await this.prisma.user.update({
        where: { id: original },
        data: { discord_id: deleted.discord_id },
      })
    } else if (!originalAcc.steam_id) {
      await this.prisma.user.update({
        where: { id: original },
        data: { steam_id: deleted.steam_id },
      })
    }
  }

  // update account info
  async updateAccount(userId: string, dto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      include: { Egg: true },
      data: {
        game_id: dto.game_id,
        bio: dto.bio,
        avatar: dto.avatar,
        displayName: dto.displayName,
      },
    })
  }

  // check if username is unique
  async checkUsernameUnique(username: string, userId: string) {
    return await this.prisma.user.findFirst({
      where: { game_id: username, id: { not: userId } },
    })
  }

  // delete account
  async deleteAccount(id: string) {
    return await this.prisma.user.delete({ where: { id } })
  }

  // get user accounts
  async searchProfiles(page: number, search: string) {
    const count = await this.prisma.user.count({
      where: { game_id: { contains: search, mode: 'insensitive' } },
    })
    const users = await this.prisma.user.findMany({
      where: { game_id: { contains: search, mode: 'insensitive' } },
      skip: this.pageSize * (page - 1),
      take: this.pageSize,
      include: { Egg: true },
    })
    return { count, users }
  }

  // get user accounts with my connection
  async searchProfilesWithCons(page: number, search: string, userId: string) {
    const connections = await this.prisma.chatRoom.findMany({
      where: { UserChatRoom: { some: { userId } }, isPrivate: true },
    })

    const ids = connections.map((item) => item.id)

    const count = await this.prisma.user.count({
      where: { game_id: { contains: search, mode: 'insensitive' } },
    })
    const users = await this.prisma.user.findMany({
      where: { game_id: { contains: search, mode: 'insensitive' } },
      skip: this.pageSize * (page - 1),
      take: this.pageSize,
      include: {
        Egg: { select: { id: true } },
        UserChatRoom: {
          where: { chatRoom: { id: { in: ids } } },
        },
      },
    })
    return { count, users }
  }

  // check if has connection
  async connectedChatServer(userId: string, loggedInUser: string) {
    const connections = await this.prisma.chatRoom.findMany({
      where: {
        UserChatRoom: { some: { userId: loggedInUser } },
        isPrivate: true,
      },
    })

    const ids = connections.map((item) => item.id)

    return await this.prisma.userChatRoom.findMany({
      where: { userId, chatRoom: { id: { in: ids } } },
    })
  }
}
