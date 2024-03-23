import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ExploreService } from './explore.service'
import { Observable, map } from 'rxjs'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { UpdateAdminSettingDto } from './dto/updateAdminSetting.dto'
import { CreateEggDto } from './dto/createEggDto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  // handle market events
  @Sse('/explore-events')
  sse(): Observable<any> {
    return this.exploreService
      .getExploreEventsObservable()
      .pipe(map((data) => ({ data: data })))
  }

  // create bulk eggs
  @Post('egg')
  @UseInterceptors(FileInterceptor('file'))
  async createEggs(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateEggDto,
  ) {
    console.log(file, dto)

    return await this.exploreService
      .createEgg(dto, file)
      .then((eggs) => eggs)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // fetch eggs uncovered for explorer map
  @Get('uncovered')
  async getEggsUncovered() {
    return await this.exploreService
      .getEggsUncovered()
      .then((eggs) => eggs)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // pick up an egg
  @Post('pick-up')
  @UseGuards(JwtAuthGuard)
  async pickUpEgg(
    @Request() req,
    @Body() dto: { eggId: string; nestId: string },
  ) {
    return await this.exploreService
      .pickUpEgg(req.user.id, dto.eggId, dto.nestId)
      .then((egg) => egg)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // fetch admin settings
  @Get('admin')
  async getAdminSettings() {
    return await this.exploreService.getAdminSettings()
  }

  // update admin settings
  @Post('admin')
  @UseGuards(JwtAuthGuard)
  async upadteAdminSettings(@Body() dto: UpdateAdminSettingDto) {
    return this.exploreService
      .updateAdminSettings(dto)
      .then((data) => data)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }
}
