import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { StudentsService } from 'src/students/students.service';
import { CreateStudentDto } from 'src/students/dto/create-students.dto';
import { AuthStudentDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private studentService:StudentsService,
        private jwtService: JwtService) { }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user);
    }
    async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByLogin(userDto.login);
        if (!user) {            
            throw new UnauthorizedException({message:'Неверное имя пользователя'})
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message:'Неверный пароль'})
    }

    async registration(authDto:AuthStudentDto) {
        const candidate = await this.userService.getUserByLogin(authDto.login);
        if (candidate) {
            throw new HttpException('Пользователь с таким логином уже зарегестрирован', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(authDto.password, 5);
        const user = await this.userService.createUser({ login:authDto.login, password: hashPassword })
        const student = await this.studentService.create({name:authDto.name, surname:authDto.surname, userId:user.id})
        return this.generateToken(user);
    }

    async generateToken(user: User) {
        const payload = { login: user.login, id: user.id, role: user.role }
        return {
            token: this.jwtService.sign(payload)
        }
    }
}
