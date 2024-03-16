import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpateAdminSettingDto } from './dto/updateAdminSetting.dto'
import { Observable, Subject } from 'rxjs'
import { ExploreEventDto } from './dto/exploreEvent.dto'

@Injectable()
export class ExploreService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly exploreEvents = new Subject<ExploreEventDto>()

  // send real-time event
  async sendEvent(event: ExploreEventDto) {
    this.exploreEvents.next(event)
  }

  // marketevent getter
  getExploreEventsObservable(): Observable<ExploreEventDto> {
    return this.exploreEvents.asObservable()
  }

  // update admin settings
  async updateAdminSettings(dto: UpateAdminSettingDto) {
    return await this.prisma.adminSetting.update({
      where: { id: dto.id },
      data: { ...dto },
    })
  }
}
