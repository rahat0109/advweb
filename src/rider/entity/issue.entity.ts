import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('issues')
export class IssueEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  issue_id: number;

  @Column()
  issue_title: string;

  @Column()
  issue_description: string;

  @Column()
  posted_by: string;

  @Column()
  issue_status: string;
  rider: any;
} 
