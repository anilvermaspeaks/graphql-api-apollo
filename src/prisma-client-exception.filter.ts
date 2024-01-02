import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';
import {Prisma} from '@prisma/client'

class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: StatusCodes;
    public readonly isOperational: boolean;
    
    constructor(name: string, httpCode: StatusCodes, message: string, isBussinessError: boolean, stack) {
    
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = name;
      this.httpCode = httpCode;
      this.isOperational = isBussinessError;
      if (stack) {
        this.stack = stack
    } else{
        Error.captureStackTrace(this, this.constructor)
    }
    }
   }
   
   class APIError extends BaseError {
    constructor(name, httpCode = StatusCodes.INTERNAL_SERVER_ERROR, isBussinessError = true, message = 'Something went wrong', stack = false) {
      super(name, httpCode, message, isBussinessError, stack);
    }
   }

  const errorHandler =(method, exception, ) =>{
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = 'Something went wrong';
        let isBussinessError = true;
        const stack = process.env.NODE_ENV==='production';
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2000':
                    statusCode = StatusCodes.BAD_REQUEST;
                    message = 'Invalid request payload';
                    isBussinessError = false
                    break;
                case 'P2001':
                    statusCode = StatusCodes.NOT_FOUND;
                    message = 'request does not exist';
                    break;
                case 'P2002':
                    statusCode = StatusCodes.CONFLICT;
                    message = `this ${exception?.meta?.target} is already used`;
                    break;
                case 'P2012':
                    statusCode = StatusCodes.BAD_REQUEST;
                    message = `Missing mandatory value in ${exception?.meta?.path}`;
                    isBussinessError = false
                    break;

            }
        }
    throw new APIError(
        method,
        statusCode,
        isBussinessError,
        message, stack)
   };
   export default errorHandler;