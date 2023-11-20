import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';

export class RiderDto {
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @IsString({ message: 'Invalid input type.' })
  @MaxLength(100)
  name: string;

  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid Email.' })
  email: string;

  @IsString({ message: 'Invalid input type.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.*[a-zA-Z0-9@#$%^&+=!]).{8,}$/,
    {
      message: 'Password is not strong enough.',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'Address cannot be empty.' })
  @IsString({ message: 'Invalid input type.' })
  address: string;

  @IsString({ message: 'Invalid input type.' })
  @MaxLength(11)
  phone: string;

  filename: string;
} 
