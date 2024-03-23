import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateAdminSettingDto } from './dto/updateAdminSetting.dto'
import { Observable, Subject } from 'rxjs'
import { ExploreEventDto } from './dto/exploreEvent.dto'
import { UploadService } from 'src/upload/upload.service'
import { CreateEggDto } from './dto/createEggDto'

@Injectable()
export class ExploreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  private readonly exploreEvents = new Subject<ExploreEventDto>()

  // send real-time event
  async sendEvent(event: ExploreEventDto) {
    this.exploreEvents.next(event)
  }

  // marketevent getter
  getExploreEventsObservable(): Observable<ExploreEventDto> {
    return this.exploreEvents.asObservable()
  }

  // get admin settings
  async getAdminSettings() {
    return await this.prisma.adminSetting.findFirst()
  }

  // update admin settings
  async updateAdminSettings(dto: UpdateAdminSettingDto) {
    return await this.prisma.adminSetting.update({
      where: { id: dto.id },
      data: { ...dto },
    })
  }

  // create an egg on the map
  async createEgg(dto: CreateEggDto, image: Express.Multer.File) {
    const egg = await this.prisma.egg.create({
      data: {
        x: dto.x,
        y: dto.y,
        rotate: dto.rotate,
        color: dto.color,
        pattern: dto.pattern,
      },
    })
    this.uploadService.uploadEggImage(image, egg.id)

    return egg
  }

  async getEggsUncovered() {
    return await this.prisma.egg.findMany({ where: { owner: null } })
  }

  async pickUpEgg(userId: string, eggId: string, nestId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lifetime_collected: { increment: 1 } },
    })

    return await this.prisma.egg.update({
      where: { id: eggId },
      data: { userId, nestId },
    })
  }
}
