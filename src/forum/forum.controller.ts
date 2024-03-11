import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ForumService } from './forum.service'
import { SearchParamType } from 'utils/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { PostDto } from './dto/post.dto'

@Controller('forum')
export class ForumController {
  constructor(private forumService: ForumService) {}

  @Get('channels')
  async getChannels() {
    return await this.forumService.getChannels()
  }

  @Get('channel/:title')
  async addChannel(@Param('title') title: string) {
    return await this.forumService.addChannel(title)
  }

  @Post('channel/:id')
  async updateChannel(
    @Param('id') id: string,
    @Body() { title }: { title: string },
  ) {
    return await this.forumService.updateChannel(id, title)
  }

  @Delete('channel/:id')
  async deleteChannel(@Param('id') id: string) {
    return await this.forumService.deleteChannel(id)
  }

  // retrieve posts
  @Post('posts')
  async getPosts(@Body() dto: SearchParamType & { category: string }) {
    const { category, ...rest } = dto
    return await this.forumService
      .getPosts(rest, category)
      .then((data) => data)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  @Get('post/:id')
  async getPost(@Param('id') id: string) {
    return await this.forumService
      .getPost(id)
      .then((post) => post)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // add post
  @Post('post')
  @UseGuards(JwtAuthGuard)
  async addPost(@Request() req, @Body() dto: PostDto) {
    return await this.forumService
      .addPost(req.user.id, dto)
      .then((post) => post)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // delete posts
  @Post('delete-posts')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Body() { ids }: { ids: string[] }) {
    return await this.forumService.deletePost(ids)
  }

  // add comment
  @Post('comment/:id')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Request() req,
    @Param('id') post: string,
    @Body() { content }: { content: string },
  ) {
    return await this.forumService
      .addComment(req.user.id, post, content)
      .then((comment) => comment)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // delete commnet
  @Delete('comment/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: string) {
    return await this.forumService.deleteComment(id)
  }
}
