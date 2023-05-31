import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model,Table } from "sequelize-typescript";
import { File } from "src/files/files.model";
import { PracticeFile } from "./practice-file.model";
import { Practice } from "./practice.model";
import { VariantFile } from "./variant-file.model";




@Table({tableName:'variant'})
export class Variant extends Model<Variant>{
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.INTEGER,  allowNull:false})
    number:number;

    @BelongsToMany(() => File, () => VariantFile)
    additionalFiles: File[];

}

