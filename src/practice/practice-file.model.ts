import { Model, Column, Table, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Practice } from './practice.model';
import { File } from 'src/files/files.model';

@Table
export class PracticeFile extends Model<PracticeFile> {
  @ForeignKey(() => Practice)
  @Column
  practiceId: number;

  @ForeignKey(() => File)
  @Column
  fileId: number;
}