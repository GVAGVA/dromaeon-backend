import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { PostDto } from './dto/post.dto'
import { SearchParamType } from 'utils/common'

@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  // forum channel services
  async getChannels() {
    return await this.prisma.forumChannel.findMany()
  }

  async addChannel(title: string) {
    return await this.prisma.forumChannel.create({
      data: { title },
    })
  }

  async updateChannel(id: string, title: string) {
    return await this.prisma.forumChannel.update({
      where: { id },
      data: { title },
    })
  }

  async deleteChannel(id: string) {
    return await this.prisma.forumChannel.delete({
      where: { id },
    })
  }

  // forum post services
  async getPosts(
    { page, pageSize, sort, search }: SearchParamType,
    category: string,
  ) {
    if (category) {
      return await this.prisma.post.findMany({
        where: { channel: { id: category }, title: { contains: search || '' } },
        select: {
          poster: { select: { id: true, avatar: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      })
    }

    return await this.prisma.post.findMany({
      where: { title: { contains: search || '' } },
      select: {
        poster: { select: { id: true, avatar: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  }

  async addPost(userId: string, dto: PostDto) {
    const { title, content, forumChannelId } = dto

    return await this.prisma.post.create({
      data: { title, content, forumChannelId, userId },
    })
  }

  async deletePost(ids: string[]) {
    return await this.prisma.post.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }

  // forum comment services
  async addComment(userId: string, postId: string, content: string) {
    return await this.prisma.comment.create({
      data: { userId, content, postId },
    })
  }

  async deleteComment(id: string) {
    return await this.prisma.comment.delete({
      where: { id },
    })
  }
}
