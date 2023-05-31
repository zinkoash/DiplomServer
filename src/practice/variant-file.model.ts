import { Model, Column, Table, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { File } from 'src/files/files.model';
import { Variant } from './variant.model';

@Table
export class VariantFile extends Model<VariantFile> {
  @ForeignKey(() => Variant)
  @Column
  variantId: number;

  @ForeignKey(() => File)
  @Column
  fileId: number;
}