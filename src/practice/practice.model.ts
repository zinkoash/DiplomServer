import { BeforeBulkDestroy, BeforeDestroy, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model,Table } from "sequelize-typescript";
import { File } from "src/files/files.model";
import { PracticeFile } from "./practice-file.model";
import { Variant } from "./variant.model";
import { PracticeVariant } from "./practice-variant.model";




@Table({tableName:'practice'})
export class Practice extends Model<Practice>{
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number;
    
    @Column({type:DataType.STRING,  allowNull:false})
    name:string;

    @Column({type:DataType.STRING,  allowNull:false})
    description:string;
    
    @Column({type:DataType.INTEGER,  allowNull:false})
    number:number;
    
    @ForeignKey(() => File)
    @Column
    mainFileId: number;
    
    @BelongsTo(()=>File, {foreignKey: 'mainFileId', onDelete:'CASCADE', onUpdate:'CASCADE'} )
    mainFile:File;

    @BelongsToMany(() => File, () => PracticeFile)
    additionalFiles: File[];
    
    @BelongsToMany(() => Variant, () => PracticeVariant)
    variants: Variant[];

    // @BeforeBulkDestroy
    // static async beforeDestroy(practice: Practice, options: any) {
    //     await PracticeVariant.destroy({ where: { practiceId: practice.id } });
    //     await PracticeFile.destroy({ where: { practiceId: practice.id } });
    // }
}

