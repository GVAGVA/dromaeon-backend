import { PartialType } from '@nestjs/mapped-types'
import { AddFaqItem } from './addFaqDto'

export class UpdateFaqDto extends PartialType(AddFaqItem) {}
