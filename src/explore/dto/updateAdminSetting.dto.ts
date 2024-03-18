import { PartialType } from '@nestjs/mapped-types'
import { CreateAdminSettingDto } from './createAdminSetting.dto'

export class UpdateAdminSettingDto extends PartialType(CreateAdminSettingDto) {}
