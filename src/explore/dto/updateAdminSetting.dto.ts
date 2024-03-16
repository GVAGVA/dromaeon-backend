import { PartialType } from '@nestjs/mapped-types'
import { CreateAdminSettingDto } from './createAdminSetting.dto'

export class UpateAdminSettingDto extends PartialType(CreateAdminSettingDto) {}
