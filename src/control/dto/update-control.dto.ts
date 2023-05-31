import { PartialType } from '@nestjs/mapped-types';
import { CreateControlDto } from './create-control.dto';

export class UpdateControlDto extends PartialType(CreateControlDto) {}
