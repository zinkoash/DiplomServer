import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Model,Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Result } from "./result.model";
import { StudentResult } from "./student-result.model";

interface StudentCreationAttrs{
    name:string;
    surname:string;
    userId:number;

}

@Table({tableName:'students'})
export class Student extends Model<Student,StudentCreationAttrs>{

    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.STRING, allowNull:false})
    name:string;
    
    @Column({type:DataType.STRING, allowNull:false})
    surname:string;

    @ForeignKey(() => User)
    @Column({type:DataType.INTEGER})
    userId:number;

    @BelongsTo(()=>User, 'userId')
    user:User;

    @BelongsToMany(()=>Result, ()=>StudentResult)
    results: Result[]
}