import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../db/models/User';
import { getRepository, Equal } from 'typeorm';
import { Logger } from '@overnightjs/logger';

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  private user = getRepository(User);

  public validate(email: string, args: ValidationArguments) {
    email = email && email.toLocaleLowerCase();
    return this.user.find({ where: { email } }).then((user) => {
      return !(user && user.length > 0);
    });
  }
}
