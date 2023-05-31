import { Practice } from 'src/practice/practice.model';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model,Table } from "sequelize-typescript";
import { File } from 'src/files/files.model';
import { Student } from './students.model';





@Table({tableName:'result'})
export class Result extends Model<Result>{
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.STRING,  allowNull:false, defaultValue:'Проверка'})
    status:string;

    @Column({type:DataType.STRING,  allowNull:true})
    description:string;
    
    @ForeignKey(() => Practice)
    @Column
    practiceId: number;
    
    @ForeignKey(() => Student)
    @Column
    studentId: number;
    
    @ForeignKey(()=>File)
    @Column
    fileId:number;

    @BelongsTo(()=>File, 'fileId')
    file:File;
}

