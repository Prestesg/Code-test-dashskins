import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './controller/user.controller'
import { AppService } from './app.service';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path/posix';
import { User, UserSchema } from './model/user.schema';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [
    UserController,
    AppController],
  providers: [UserService,AppService],
})
export class AppModule {}
