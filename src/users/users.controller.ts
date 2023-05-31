import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ChangeRoleDto } from './dto/changeRole.dto';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('users')
export class UsersController {
    
    constructor(private usersService: UsersService ){}
    
    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.usersService.createUser(userDto);
    }
    // @UseGuards(JwtAuthGuard)
    // @Roles("ADMIN")
    // @UseGuards(RolesGuard)
    @Get()
    getAll(){
        return this.usersService.getAllUsers()
    }

    @UseGuards(JwtAuthGuard)
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Put('/role')
    changeRole(@Body() dto: ChangeRoleDto){
        return this.usersService.changeRole(dto);
    }

    
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@UserId() id:number){
        return this.usersService.findById(id);
    }
}
