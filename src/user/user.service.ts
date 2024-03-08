import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Currency, User } from '@prisma/client'
import { UpdateUserDto } from './dto/updateUserDto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // find user by game_id
  async findOne(gameId: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { game_id: gameId } })
  }

  // find user by id
  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  // connect accounts from discord to steam and vice versa
  async connectAccount(original: string, newAccount: string) {
    const user = await this.prisma.user.findUnique({ where: { id: original } })
    if (!user) {
      throw new NotFoundException()
    }

    const deleted = await this.prisma.user.delete({ where: { id: newAccount } })
    if (!user.discord_id) {
      return await this.prisma.user.update({
        where: { id: original },
        data: { discord_id: deleted.discord_id },
      })
    } else if (!user.steam_id) {
      return await this.prisma.user.update({
        where: { id: original },
        data: { steam_id: deleted.steam_id },
      })
    }
  }

  // update account info
  async updateAccount(userId: string, dto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        game_id: dto.game_id,
        bio: dto.bio,
        avatar: dto.avatar,
      },
    })
  }
}
