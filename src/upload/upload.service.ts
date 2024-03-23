import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'

@Injectable()
export class UploadService {
  async uploadEggImage(image: Express.Multer.File, eggId: string) {
    const dirPath = `files/eggs`

    await this.fileUpload({ dirPath, fileName: `${eggId}.png`, image })
    return `${dirPath}/${eggId}.png`
  }

  async fileUpload({
    dirPath,
    fileName,
    image,
  }: {
    dirPath: string
    fileName: string
    image: Express.Multer.File
  }) {
    if (!existsSync(dirPath)) {
      await mkdir(dirPath)
    }

    const err: any = await writeFile(`${dirPath}/${fileName}`, image.buffer)

    if (err) {
      throw new InternalServerErrorException('file upload failed')
    }

    return `${dirPath}/${fileName}`
  }
}
