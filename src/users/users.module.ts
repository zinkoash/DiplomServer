import { SequelizeModule } from '@nestjs/sequelize';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';
import { Role } from 'src/roles/role.model';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[
    SequelizeModule.forFeature([
      User,
      Role,
    ]),
    forwardRef(()=>AuthModule),
    RolesModule,
  ],
  exports:[
    UsersService,
  ]
})
export class UsersModule {}
