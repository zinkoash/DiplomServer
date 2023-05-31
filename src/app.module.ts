import { User } from './users/users.model';
import { MiddlewareConsumer, Module } from "@nestjs/common";

import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";

import { RolesModule } from './roles/roles.module';
import { Role } from './roles/role.model';

import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { PracticeModule } from './practice/practice.module';
import { Practice } from './practice/practice.model';
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static';
import { StudentsModule } from './students/students.module';
import * as path from 'path';
import { CorsMiddleware } from './midlewares/cors-midleware';
import { Student } from './students/students.model';

import { TheoryModule } from './theory/theory.module';

import { File } from './files/files.model';
import { PracticeFile } from './practice/practice-file.model';
import { Variant } from './practice/variant.model';
import { VariantFile } from './practice/variant-file.model';
import { PracticeVariant } from './practice/practice-variant.model';
import { Result } from './students/result.model';
import { StudentResult } from './students/student-result.model';
import { ControlModule } from './control/control.module';
import { HelpModule } from './help/help.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname,'..', 'static')
        }),
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, Practice, Student, File, PracticeFile, Variant, VariantFile, PracticeVariant, Result, StudentResult],
            autoLoadModels: true,
            synchronize: true,
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        FilesModule,
        PracticeModule,
        StudentsModule,
        TheoryModule,
        ControlModule,
        HelpModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorsMiddleware).forRoutes('*');
    }
}