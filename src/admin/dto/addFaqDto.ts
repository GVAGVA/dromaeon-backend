import { IsNotEmpty } from 'class-validator'

export class AddFaqItem {
  @IsNotEmpty()
  question: string

  @IsNotEmpty()
  answer: string
}
