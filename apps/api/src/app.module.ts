import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CategriesModule } from './categories/categries.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CategriesModule,
    PostsModule,
    TagsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
