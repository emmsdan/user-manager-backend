import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsNotUserAlreadyExistConstraint } from './user.contraints';

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
