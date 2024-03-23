import { IsNegative, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateEggDto {
  @IsNumber()
  x: number

  @IsNumber()
  y: number

  @IsNumber()
  rotate: number

  @IsString()
  color: string

  @IsString()
  pattern: string

  // @IsNotEmpty()
  // file: Express.Multer.File
}
