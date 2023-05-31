import { BelongsToMany } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, HasOne, Model,Table } from "sequelize-typescript";
import { Practice } from "src/practice/practice.model";



@Table({tableName:'files'})
export class File extends Model<File>{
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.STRING,  allowNull:false})
    fileName:string;

    @Column({type:DataType.STRING,  allowNull:false})
    folder:string;


}