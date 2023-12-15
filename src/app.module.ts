import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { MailerModule } from '@nest-modules/mailer';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_DATABASE_URL'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: 'dinhphamcanh@gmail.com',
            pass: 'tklv xmeh kynt yxir',
          },
        },
        defaults: {
          from: `"Tranh tường miền Bắc" <${configService.get('MAIL_FROM')}>`,
        },
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        '/api/auth/(.*)',
        {
          path: '/api/subjects',
          method: RequestMethod.GET,
        },
        {
          path: '/api/schedules/find',
          method: RequestMethod.POST,
        },
        {
          path: '/api/schedules',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('*');
  }
}
