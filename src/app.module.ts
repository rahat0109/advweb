import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module'; // Import the UserModule

 

@Module({
  imports: [UserModule], // Add UserModule to the imports array
  controllers: [], // Add your other controllers here
  providers: [], // Add your other providers here
})
export class AppModule {}