import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  IsUserAlreadyExistConstraint,
  IsNotUserAlreadyExistConstraint,
} from './user.contraints';

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  // tslint:disable-next-line: ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}

export function IsNotUserAlreadyExist(validationOptions?: ValidationOptions) {
  // tslint:disable-next-line: ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotUserAlreadyExistConstraint,
    });
  };
}
