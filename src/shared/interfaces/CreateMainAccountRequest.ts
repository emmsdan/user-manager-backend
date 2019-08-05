import { IsEmail, IsEnum, IsAlpha, IsNotEmpty } from 'class-validator';
import { IsUserAlreadyExist } from '../validations/user.validation';
import { UserRole } from '../constants';

export class CreateMainAccount {
  @IsAlpha()
  @IsNotEmpty()
  public firstName: string;

  @IsAlpha()
  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUserAlreadyExist({
    message: 'A user with this email already exist.',
  })
  public email: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  public role: UserRole;
}

// tslint:disable-next-line: max-classes-per-file
export class Create {}
