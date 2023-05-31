import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { StudentsModule } from 'src/students/students.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    forwardRef(()=> UsersModule),
    forwardRef(()=> StudentsModule),
    JwtModule.register({
      secret:process.env.SECRET_KEY||"Secret",
      signOptions:{
        expiresIn:'72h'
      }
    })
  ],
  exports:[
    AuthService,
    JwtModule,
  ]
})
export class AuthModule {}
