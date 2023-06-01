import { BelongsTo, Column, DataType, ForeignKey, Model,Table } from "sequelize-typescript";
import { Role } from "src/roles/role.model";

interface UserCreationAttrs{
    login:string;
    password:string;

}

@Table({tableName:'users'})
export class User extends Model<User,UserCreationAttrs>{
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.STRING, unique:true, allowNull:false})
    login:string;
    
    @Column({type:DataType.STRING, allowNull:false})
    password:string;

    @ForeignKey(() => Role)
    @Column({type:DataType.INTEGER, defaultValue: 2})
    roleId:number;

    @BelongsTo(()=>Role, 'roleId')
    role:Role;
}