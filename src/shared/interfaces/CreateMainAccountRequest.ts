import { IsEmail, IsEnum, IsAlpha, IsNotEmpty } from 'class-validator';
import { IsUserAlreadyExist } from '../validations/user.validation';

export enum Roles {
  Developer,
  SuperAdmin,
  Modirator,
}

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
  @IsEnum(Roles)
  public role: Roles;
}

// tslint:disable-next-line: max-classes-per-file
export class Create {}
