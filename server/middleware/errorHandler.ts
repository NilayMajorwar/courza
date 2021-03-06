import * as Errors from '../utils/errors';
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next?: NextFunction
) {
  console.log(err);
  switch (err.name) {
    case 'NotFoundError':
      return res.status(404).send('Resource does not exist.');
    case 'ValidationError':
      return res.status(400).send('Data validation failed.');
    case 'CredentialsError':
      return res.status(401).send('Bad credentials.');
    case 'MongoError':
    case 'DuplicateError':
      return res.status(409).send('Resource with same key already exists.');
    case 'AuthorizationError':
      return res.status(403).send('Invalid or missing token found.');
    default:
      return res.status(500).send('An unknown error occurred.');
  }
}
