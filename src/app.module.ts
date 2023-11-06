import { Module } from '@nestjs/common';
import { RiderModule } from './rider/rider.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    RiderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'rahat',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
