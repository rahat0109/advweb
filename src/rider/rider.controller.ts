import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UsePipes,
  ValidationPipe,
  Session,
  UnauthorizedException,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderDto } from './rider.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SessionGuard } from './session.guard';
import { RiderEntity } from './entity/rider.entity';
import { DeliveryEntity } from './entity/delivery.entity';
import { IssueEntity } from './entity/issue.entity';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  //Signup + FileUpload
  @Post('/signup')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  signUp(
    @Body() riderDto: RiderDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 200000 }),
          new FileTypeValidator({ fileType: 'png|jpg|jpeg|' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    riderDto.filename = file.filename;
    return this.riderService.signUp(riderDto);
  }

  //Login
  @Post('/signin')
  @UsePipes(new ValidationPipe())
  async signin(@Session() session, @Body() riderDto: RiderDto) {
    const res = await this.riderService.signin(riderDto);
    if (res == true) {
      session.email = riderDto.email;
      return session.email;
    } else {
      throw new UnauthorizedException({ message: 'invalid credentials' });
    }
  }

  //Update Rider Profile
  @Put('/update-rider/:id')
  @UseGuards(SessionGuard)
  async updateProfileById(
    @Param('id') id: any,
    @Body() riderDto: RiderDto,
  ): Promise<RiderEntity> {
    return this.riderService.updateRiderProfileById(id, riderDto);
  }

  //Delete Rider Profile
  @Delete('/delete-rider/:id')
  async deleteProfileById(@Param('id') id: any): Promise<void> {
    await this.riderService.deleteRiderProfileById(id);
  }

  //Show all Riders
  @Get('all-rider')
  async allRider(): Promise<RiderEntity[]> {
    return this.riderService.getAllRiders();
  }

  //Search Rider by id
  @Get('search-rider/:id')
  async searchRiderById(@Param('id') id: number): Promise<RiderEntity> {
    const rider = await this.riderService.getRiderById(id);

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }

    return rider;
  }

  //Rider logout [Session Destroy]
  @Post('/rider-logout')
  async logout(@Session() session, @Req() request) {
    if (session.email) {
      session.email = null;
      request.session.destroy();
      return { message: 'Rider logged out successfully' };
    } else {
      return { message: 'Rider not logged in' };
    }
  }

  //Show all deliveries
  async allDeliveries(): Promise<DeliveryEntity[]> {
    return this.riderService.getAllDeliveries();
  }

  //Delivery Details by ID
  @Get('/delivery-details/:id')
  async deliveryDetails(@Param('id') id: any): Promise<DeliveryEntity> {
    const delivery = await this.riderService.getDeliveryDetailsById(id);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    return delivery;
  }

  //Delivery Accept
  @Put('/delivery/:id/accept')
  async deliveryAccept(@Param('id') id: any): Promise<DeliveryEntity> {
    const delivery = await this.riderService.acceptDelivery(id);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  //Delivery status
  @Put('/delivery/:id/reject')
  async deliveryReject(@Param('id') id: any): Promise<DeliveryEntity> {
    const delivery = await this.riderService.rejectDelivery(id);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  //Delivery status
  @Put('/delivery/:id/start')
  async deliveryStart(@Param('id') id: any): Promise<DeliveryEntity> {
    const delivery = await this.riderService.startDelivery(id);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  //Delivery status
  @Put('/delivery/:id/complete')
  async deliveryComplete(@Param('id') id: any): Promise<DeliveryEntity> {
    const delivery = await this.riderService.completeDelivery(id);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  //Delivery details
  @Get('/delivery/:id')
  async deliveryDetailsById(@Param('id') id: any): Promise<DeliveryEntity> {
    const delivery = await this.riderService.getDeliveryDetailsById(id);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }
    return delivery;
  }

  //Issue Post
  @Post('/post-issue')
  async postIssue(
    @Body() issueData: Partial<IssueEntity>,
  ): Promise<IssueEntity> {
    const newIssue = await this.riderService.postIssue(issueData);
    return newIssue;
  }

  //Issue status
  @Put('update-issue/:id')
  async updateIssue(
    @Param('id') id: any,
    @Body() updatedData: Partial<IssueEntity>,
  ): Promise<IssueEntity> {
    const updatedIssue = await this.riderService.updateIssue(id, updatedData);

    if (!updatedIssue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return updatedIssue;
  }

  //Issue delete
  @Delete('delete-issue/:id')
  async deleteIssueById(@Param('id') id: any): Promise<void> {
    await this.riderService.deleteIssueById(id);
  }

  //Issue search
  @Get('search-issue/:id')
  async searchIssueById(@Param('id') id: any): Promise<IssueEntity> {
    const issue = await this.riderService.getIssueById(id);

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
    return issue;
  }

  //Issue details
  @Get('issue-details/:id/solved')
  async issueSolved(@Param('id') id: any): Promise<IssueEntity> {
    const updatedIssue = await this.riderService.markIssueAsSolved(id);

    if (!updatedIssue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return updatedIssue;
  }

  //Send mail
  @Post('/sendemail')
  sendEmail(@Body() mydata) {
    return this.riderService.sendEmail(mydata);
  }
}
