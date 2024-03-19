import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-steam'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '../auth.service'

@Injectable()
export class SteamStrategy extends PassportStrategy<any>(Strategy, 'steam') {
  constructor(
    readonly config: ConfigService,
    private authService: AuthService,
  ) {
    const appUrl = config.get('APP_URL') || ''
    super({
      returnURL: `${appUrl}auth/s-redirect`,
      realm: appUrl,
      apiKey: config.get('STEAM_API_KEY') || '',
    })
  }

  async validate(
    _identifier,
    profile: any,
    done: (err: any, val: any) => void,
  ): Promise<any> {
    console.log(profile)

    const jwtToken = this.authService.handleSteamLogin({
      id: profile.id,
      displayName: profile.displayName,
      avatar: profile.photos[0].value,
      username: profile.displayName,
    })

    return done(null, jwtToken)
  }
}
