import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUserExistConstraint } from './user.contraints';

export function IsUserExist(validationOptions?: ValidationOptions) {
  // tslint:disable-next-line: ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserExistConstraint,
    });
  };
}
