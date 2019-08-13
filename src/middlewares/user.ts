import { Response, Request } from 'express';
import { verifyToken } from '../shared/helpers/helpers';
import { getUser } from '../shared/utils';
import ResponseHandler from '../shared/helpers/ResponseHandler';

/**
 * validateUserToken
 * @description validate all users token
 * @param request Express Request
 * @param response Express Response
 * @param next Express Next method
 */
export async function validateUserToken(
  request: Request,
  response: Response,
  next: any
) {
  try {
    const accessToken = `${request.headers.accesstoken}`;
    const { email } = verifyToken(accessToken);

    const user = await getUser(email);
    const { body } = request;
    const { company, password } = body;

    request.body = {
      ...body,
      user,
      validatedUser: { ...user, company, password, accessToken },
    };
    return next();
  } catch ({ message }) {
    return new ResponseHandler(response, 1208, message);
  }
}
