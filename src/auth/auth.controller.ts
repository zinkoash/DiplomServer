import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateStudentDto } from 'src/students/dto/create-students.dto';
import { AuthStudentDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    @Post('/login')
    login(@Body() userDto: CreateUserDto){  
        return this.authService.login(userDto)
    }
    
    @Post('/registration')
    registration(@Body() registrDto:AuthStudentDto){
        return this.authService.registration(registrDto)
    }

}
