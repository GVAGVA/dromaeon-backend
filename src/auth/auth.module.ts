import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { DiscordStrategy } from './strategies/discord'
import { SteamStrategy } from './strategies/steam'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'utils/jwtKey'
import { JwtStrategy } from './strategies/jwt'
import { UserModule } from 'src/user/user.module'

@Module({
  providers: [AuthService, DiscordStrategy, SteamStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3d' },
    }),
    UserModule,
  ],
})
export class AuthModule {}
