import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { EggModule } from './egg/egg.module'
import { ChatModule } from './chat/chat.module'
import { NotificationModule } from './notification/notification.module'
import { PrismaModule } from './prisma/prisma.module'
import { ForumModule } from './forum/forum.module'
import { ConfigModule } from '@nestjs/config'
import { CurrencyModule } from './currency/currency.module'
import { InventoryModule } from './inventory/inventory.module'
import { MarketModule } from './market/market.module'
import { SocketModule } from './socket/socket.module';
import { ExploreModule } from './explore/explore.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    EggModule,
    ChatModule,
    NotificationModule,
    PrismaModule,
    ForumModule,
    CurrencyModule,
    InventoryModule,
    MarketModule,
    SocketModule,
    ExploreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
