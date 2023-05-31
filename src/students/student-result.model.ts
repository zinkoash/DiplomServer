import { Model, Column, Table, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Student } from './students.model';
import { Result } from './result.model';

@Table
export class StudentResult extends Model<StudentResult> {
  @ForeignKey(() => Student)
  @Column
  studentId: number;

  @ForeignKey(() => Result)
  @Column
  resultId: number;
}