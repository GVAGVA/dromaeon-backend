import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  // get all chat rooms

  // get all messages for a chat room

  // send Message
}
