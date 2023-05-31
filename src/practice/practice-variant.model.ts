import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { File } from "src/files/files.model";
import { Practice } from "./practice.model";
import { Variant } from "./variant.model";




@Table({ tableName: 'practice-variant' })
export class PracticeVariant extends Model<PracticeVariant>{
    @ForeignKey(() => Practice)
    @Column
    practiceId: number;

    @ForeignKey(() => Variant)
    @Column
    variantId: number;
}


