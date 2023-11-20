import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiderEntity } from './entity/rider.entity';
import { DeliveryEntity } from './entity/delivery.entity';
import { IssueEntity } from './entity/issue.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'rahat57viiia@gmail.com',
          pass: 'ypqa bboy aven yplw',
        },
      },
    }),
    TypeOrmModule.forFeature([RiderEntity, DeliveryEntity, IssueEntity]),
  ],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
