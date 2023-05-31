import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './role.model';
import { User } from 'src/users/users.model';
import { UserRoles } from './user-roles.model';

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports:[
      SequelizeModule.forFeature([
        Role,
        User,
      ])
    ],
    exports:[RolesService],
  })
export class RolesModule {}
