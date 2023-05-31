import { JwtService } from '@nestjs/jwt';


import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';
import { RolesService } from 'src/roles/roles.service';
import { log } from 'console';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private reflector: Reflector,
        private roleService:RolesService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ])
            if (!requiredRole) {
                return true;
            }
            const req = context.switchToHttp().getRequest()
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
            }
            const user = this.jwtService.verify(token);
            req.user = user;
            
            return user.role.role === requiredRole[0]
        } catch (e) {
            console.log(e);
            
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}