import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/roles/role.model';
import { ChangeRoleDto } from './dto/changeRole.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService) {

    }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        return user;
    }
    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: Role });
        return users;
    }
    async getUserByLogin(login: string) {
        const user = await this.userRepository.findOne({ where: { login }, include: { all: true } })
        return user;
    }
    async changeRole(dto: ChangeRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleService.getRoleById(dto.roleId)
        if (user && role) {
            await user.update({ roleId: role.id }, { where: { id: user.id } })
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.BAD_REQUEST)
    }
    findById(id: number) {
        return this.userRepository.findOne({
            where: { id },
            include: { all: true }
        });
    }
}
