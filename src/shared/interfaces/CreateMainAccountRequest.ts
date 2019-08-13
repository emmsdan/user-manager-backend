import {
  IsEmail,
  IsEnum,
  IsAlpha,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';

import { IsNotUserAlreadyExist } from '../validations/user.validation';
import { UserRole } from '../constants';
import { User } from 'src/db/models/User';

export class CreateMainAccount {
  @IsAlpha()
  @IsNotEmpty()
  public firstName: string;

  @IsAlpha()
  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsNotUserAlreadyExist({
    message: 'A user with this email already exist.',
  })
  public email: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  public role: UserRole;
}

// tslint:disable-next-line: max-classes-per-file
export class CompleteNewRegistration {
  @IsNotEmpty()
  public company: string;

  @MinLength(5)
  public password: string;
}
