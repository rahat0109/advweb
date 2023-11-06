import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delivery')
export class DeliveryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  delivery_id: number;

  @Column()
  customer_id: number;

  @Column()
  customer_address: string;

  @Column()
  customer_phone: string;

  @Column()
  delivery_status: string;
  rider: any;
}
