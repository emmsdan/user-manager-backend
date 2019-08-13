import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../../db/models/User';
import { getRepository, Equal } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsNotUserAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  private user = getRepository(User);

  public validate(email: string, args: ValidationArguments) {
    email = email && email.toLocaleLowerCase();
    return this.user.find({ where: { email } }).then((user) => {
      return !(user && user.length > 0);
    });
  }
}
