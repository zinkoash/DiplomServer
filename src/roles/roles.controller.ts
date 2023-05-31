import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {

    constructor(private roleService: RolesService) { }

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @Get('/:id')
    getByValue(@Param('id') id: number) {
        return this.roleService.getRoleById(id);
    }

}
