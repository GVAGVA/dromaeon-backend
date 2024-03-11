import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { DiscordUser } from './dto/discord-user'
import { SteamUser } from './dto/steam-user'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async handleDiscordLogin(dto: DiscordUser) {
    const existingUser = await this.prisma.user.findUnique({
      where: { discord_id: dto.id },
    })

    if (existingUser) {
      return this.getJwtToken(existingUser)
    }

    // create user account
    const user = await this.prisma.user.create({
      data: {
        game_id: dto.username,
        discord_id: dto.id,
        avatar: dto.avatar,
      },
    })

    return this.getJwtToken(user)
  }

  async handleSteamLogin(dto: SteamUser) {
    const existingUser = await this.prisma.user.findUnique({
      where: { steam_id: dto.id },
    })

    if (existingUser) {
      return this.getJwtToken(existingUser)
    }

    // create user account
    const user = await this.prisma.user.create({
      data: {
        game_id: dto.displayName,
        steam_id: dto.id,
        avatar: dto.avatar,
      },
    })

    return this.getJwtToken(user)
  }

  async getJwtToken(user: User) {
    return this.jwtService.sign({
      id: user.id,
      game_id: user.game_id,
      avatar: user.avatar,
      is_admin: user.is_admin,
    })
  }
}
