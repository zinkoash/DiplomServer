import { BelongsTo, Column, DataType, ForeignKey, Model,Table } from "sequelize-typescript";
import { File } from "src/files/files.model";




@Table({tableName:'control'})
export class Control extends Model<Control>{
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.STRING,  allowNull:false})
    name:string;

    @Column({type:DataType.STRING,  allowNull:false})
    description:string;

    @ForeignKey(()=>File)
    @Column
    fileId:number;

    @BelongsTo(()=>File, {foreignKey: 'fileId', onDelete:'CASCADE'} )
    file:File;
}