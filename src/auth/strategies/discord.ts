import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, StrategyOptions, Profile } from 'passport-discord'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    const appUrl = config.get('APP_URL') || ''
    super({
      clientID: config.get('DISCORD_CLIENT_ID') || '',
      clientSecret: config.get('DISCORD_CLIENT_SECRET') || '',
      callbackURL: `${appUrl}auth/d-redirect`,
      scope: ['identify', 'email'],
    } as StrategyOptions)
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, val: any) => void,
  ): Promise<any> {
    console.log(profile)
    const jwtToken = this.authService.handleDiscordLogin({
      id: profile.id,
      username: profile.username,
      displayName: profile.global_name || '',
      avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
    })

    return done(null, jwtToken)
  }
}
