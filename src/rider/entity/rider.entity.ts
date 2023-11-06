// rider.entity.ts

import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { IssueEntity } from './issue.entity';
import { DeliveryEntity } from './delivery.entity'; // Import the DeliveryEntity

@Entity('rider')
export class RiderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  rider_id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  filename: string;

  @OneToMany(() => IssueEntity, (issue) => issue.rider)
  issues: IssueEntity[];

  @OneToMany(() => DeliveryEntity, (delivery) => delivery.rider) // Define the one-to-many relationship
  deliveries: DeliveryEntity[]; // Add an array of deliveries
}
