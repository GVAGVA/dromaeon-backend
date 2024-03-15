export const chatRoomSelection = (userId: string) => ({
  include: {
    chatRoom: {
      select: {
        id: true,
        updatedAt: true,
        name: true,
        participants: { select: { id: true, avatar: true, game_id: true } },
        UserChatRoom: {
          where: { userId: { not: userId } },
          select: {
            user: { select: { id: true, game_id: true, avatar: true } },
          },
        },
        messages: {
          select: {
            content: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    },
  },
  orderBy: {
    chatRoom: {
      updatedAt: 'desc',
    },
  },
})
