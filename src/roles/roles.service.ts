import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role){}
    
    async createRole(dto: CreateRoleDto){
        const role = await this.roleRepository.create(dto);
        return role;
    }

    // async getRoleByValue(role:string){
    //     const roles = await this.roleRepository.findOne({where:{role}})
    //     return roles;
    // }
    async getRoleById(id:number){
        const role = await this.roleRepository.findOne({where:{id:id}})
        return role;
    }

}
