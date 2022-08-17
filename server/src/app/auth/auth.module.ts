import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { AuthenticateUserByEmailAndPassword } from '../../domain/usecases/authenticate-user-by-email-and-password'
import { SignInWithUser } from '../../domain/usecases/sign-in-with-user'
import { AddUser } from '../../domain/usecases/add-user'
import { AuthenticateUserByAuthorizationToken } from '../../domain/usecases/authenticate-user-by-authorization-token'
import { makeAuthenticateUserByAuthorizationToken } from '../../infra/factories/authenticate-user-by-authorization-token-factory'
import { makeAuthenticateUserByEmailAndPassword } from '../../infra/factories/authenticate-user-by-email-and-password-factory'
import { makeAddUser } from '../../infra/factories/add-user-factory'
import { makeSignInWithUser } from '../../infra/factories/sign-in-with-user-factory'
import { AuthController } from './auth.controller'
import { EmailAndPasswordStrategy } from './strategies/email-and-password.strategy'
import { PrismaService } from '../shared/prisma/prisma.service'
import { PrismaModule } from '../shared/prisma/prisma.module'
import { AuthorizationTokenStrategy } from './strategies/authorization-token.strategy'

@Module({
  imports: [ConfigModule, PrismaModule, PassportModule],
  controllers: [AuthController],
  providers: [
    EmailAndPasswordStrategy,
    AuthorizationTokenStrategy,
    {
      provide: AddUser,
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService) => makeAddUser(prisma, +config.get<number>('BCRYPT_SALT'))
    },
    {
      provide: AuthenticateUserByEmailAndPassword,
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService) => makeAuthenticateUserByEmailAndPassword(prisma, +config.get<number>('BCRYPT_SALT'))
    },
    {
      provide: AuthenticateUserByAuthorizationToken,
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService) => makeAuthenticateUserByAuthorizationToken(prisma, config.get<string>('JWT_SECRET'))
    },
    {
      provide: SignInWithUser,
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService) => makeSignInWithUser(prisma, config.get<string>('JWT_SECRET'))
    }
  ]
})
export class AuthModule { }
