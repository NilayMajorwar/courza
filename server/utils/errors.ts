// An almost useless piece of code that I wrote for my own satisfaction.
function createError(errorName: string): any {
  return class CustomError extends Error {
    message: string;
    constructor(message?: string) {
      super(message);
      this.name = errorName;
    }
  };
}

export const NotFoundError = createError('NotFoundError');
export const ValidationError = createError('ValidationError');
export const CredentialsError = createError('CredentialsError');
export const DuplicateError = createError('DuplicateError');
export const AuthorizationError = createError('AuthorizationError');
export const ServerError = createError('ServerError');
