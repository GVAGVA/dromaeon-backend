import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'
import { AddMessageDto, SendMessageDto } from './types/addMessageDto'

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // get all chat rooms
  @Get('room')
  @UseGuards(JwtAuthGuard)
  async getChatRooms(@Request() req) {
    return await this.chatService
      .getAllUserChatRooms(req.user.id)
      .then((data) => data)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // get a specific room info
  @Get('room/:id')
  @UseGuards(JwtAuthGuard)
  async getChatRoom(@Param('id') id: string, @Request() req) {
    console.log(id, req.user.id)
    return this.chatService
      .getChatRoomById(req.user.id, id)
      .then((data) => data)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // get all messages for a chat room
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMessagesByChatRoomId(@Param('id') chatRoomId: string) {
    return await this.chatService.getAllMessagesByRoomId(chatRoomId)
  }

  // send first connection message
  @Post('connect')
  @UseGuards(JwtAuthGuard)
  async sendConnectionMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Request() req,
  ) {
    return await this.chatService.sendMessage({
      ...sendMessageDto,
      from: req.user.id,
    })
  }

  //send message to someone
  @Post('')
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Body() dto: AddMessageDto, @Request() req) {
    return await this.chatService
      .addMessage({ ...dto, userId: req.user.id })
      .then((data) => data)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  // hide chat history
  @Get('hide/:id')
  @UseGuards(JwtAuthGuard)
  async hideMessage(@Param('id') roomId: string) {
    return this.chatService
      .hideUserChatRoom(roomId)
      .then((data) => data)
      .catch((err) => {
        throw new InternalServerErrorException(err.message)
      })
  }

  @Get('open/:id')
  @UseGuards(JwtAuthGuard)
  async openChat(@Param('id') roomId: string) {
    return this.chatService.openUserChatRoom(roomId)
  }
}
