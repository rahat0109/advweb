import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RiderEntity } from './entity/rider.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RiderDto } from './rider.dto';
import { DeliveryEntity } from './entity/delivery.entity';
import { IssueEntity } from './entity/issue.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(RiderEntity)
    private riderRepo: Repository<RiderEntity>,
    @InjectRepository(DeliveryEntity)
    private deliveryRepo: Repository<DeliveryEntity>,
    @InjectRepository(IssueEntity)
    private issueRepo: Repository<IssueEntity>,
    private mailerService: MailerService,
  ) {}

  async signup(riderDto) {
    const existingRider = await this.riderRepo.findOne({
      where: { email: riderDto.email },
    });

    if (existingRider) {
      throw new Error('Email already exists. Please use a different email.');
    }
    const salt = await bcrypt.genSalt(10);
    const hassedpassed = await bcrypt.hash(riderDto.password, salt);
    riderDto.password = hassedpassed;
    return this.riderRepo.save(riderDto);
  }

  async signin(loginData) {
    const rider = await this.riderRepo.findOne({
      where: [{ email: loginData.email }],
    });

    if (rider) {
      const passwordMatch = await bcrypt.compare(
        loginData.password,
        rider.password,
      );

      if (passwordMatch) {
        return rider;
      }
    }
    return null;
  }

  async updateRiderProfileById(
    id: any,
    riderDto: RiderDto,
  ): Promise<RiderEntity> {
    const rider = await this.riderRepo.findOne({ where: { rider_id: id } });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    rider.name = riderDto.name;
    rider.address = riderDto.address;
    rider.phone = riderDto.phone;

    await this.riderRepo.save(rider);

    return rider;
  }

  async deleteRiderProfileById(id: any): Promise<any> {
    const rider = await this.riderRepo.findOne({ where: { rider_id: id } });

    if (!rider) {
      throw new NotFoundException('Rider not found');
    } else {
      await this.riderRepo.remove(rider);
      return true;
    }
  }

  async getAllRiders(): Promise<RiderEntity[]> {
    return await this.riderRepo.find();
  }

  async getRiderById(id: any): Promise<RiderEntity | null> {
    return await this.riderRepo.findOne({ where: { rider_id: id } });
  }

  async createDelivery(
    deliveryData: Partial<DeliveryEntity>,
  ): Promise<DeliveryEntity> {
    const newDelivery = this.deliveryRepo.create(deliveryData);
    return await this.deliveryRepo.save(newDelivery);
  }

  async getAllDeliveries(): Promise<DeliveryEntity[]> {
    return this.deliveryRepo.find();
  }

  async getDeliveryDetailsById(id: any): Promise<DeliveryEntity> {
    return this.deliveryRepo.findOne({ where: { delivery_id: id } });
  }

  async acceptDelivery(id: any): Promise<DeliveryEntity> {
    const delivery = await this.deliveryRepo.findOne({
      where: { delivery_id: id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    delivery.delivery_status = 'Accept';

    await this.deliveryRepo.save(delivery);

    return delivery;
  }

  async rejectDelivery(id: any): Promise<DeliveryEntity> {
    const delivery = await this.deliveryRepo.findOne({
      where: { delivery_id: id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    delivery.delivery_status = 'Reject';

    await this.deliveryRepo.save(delivery);

    return delivery;
  }

  async startDelivery(id: any): Promise<DeliveryEntity> {
    const delivery = await this.deliveryRepo.findOne({
      where: { delivery_id: id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    delivery.delivery_status = 'Start';

    await this.deliveryRepo.save(delivery);

    return delivery;
  }

  async completeDelivery(id: any): Promise<DeliveryEntity> {
    const delivery = await this.deliveryRepo.findOne({
      where: { delivery_id: id },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    delivery.delivery_status = 'Complete';

    await this.deliveryRepo.save(delivery);

    return delivery;
  }

  async postIssue(issueData: Partial<IssueEntity>): Promise<IssueEntity> {
    const newIssue = this.issueRepo.create(issueData);
    return await this.issueRepo.save(newIssue);
  }

  async updateIssue(
    id: any,
    updatedData: Partial<IssueEntity>,
  ): Promise<IssueEntity | null> {
    const existingIssue = await this.issueRepo.findOne({
      where: { issue_id: id },
    });

    if (!existingIssue) {
      throw new NotFoundException('Issue not found');
    }
    Object.assign(existingIssue, updatedData);

    return await this.issueRepo.save(existingIssue);
  }

  async deleteIssueById(id: any): Promise<any> {
    const existingIssue = await this.issueRepo.findOne({
      where: { issue_id: id },
    });

    if (!existingIssue) {
      throw new NotFoundException('Issue not found');
    } else {
      await this.issueRepo.remove(existingIssue);
      return true;
    }
  }

  async getIssueById(id: any): Promise<IssueEntity | null> {
    return await this.issueRepo.findOne({
      where: { issue_id: id },
    });
  }

  async markIssueAsSolved(id: any): Promise<IssueEntity | null> {
    const existingIssue = await this.issueRepo.findOne({
      where: { issue_id: id },
    });

    if (!existingIssue) {
      throw new NotFoundException('Issue not found');
    }

    existingIssue.issue_status = 'solved';

    return await this.issueRepo.save(existingIssue);
  }

  async sendEmail(mydata) {
    return await this.mailerService.sendMail({
      to: mydata.email,
      subject: mydata.subject,
      text: mydata.text,
    });
  }
}
