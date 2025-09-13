import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';
import { EntityNameEnum } from '../../../common/enums/entity.enum';

@Entity(EntityNameEnum.IMAGES)
export class ImageEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  alt: string;

  @CreateDateColumn()
  created_at: Date;
}
