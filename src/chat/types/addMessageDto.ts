export interface AddMessageDto {
  userId: string
  chatRoomId: string
  content: string
}

export interface SendMessageDto {
  from: string
  to: string
  content: string
}
