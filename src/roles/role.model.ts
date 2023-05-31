import { BelongsTo, HasMany, Column, DataType, ForeignKey, Model,Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { UserRoles } from "./user-roles.model";

interface RoleCreationAttrs{
    role:string;
}

@Table({tableName:'roles'})
export class Role extends Model<Role,RoleCreationAttrs>{
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    @Column({type:DataType.STRING, unique:true, allowNull:false})
    role:string;

    @HasMany(()=>User)
    user:User[]

}