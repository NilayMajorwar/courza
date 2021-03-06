import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { AuthorizationError } from '../utils/errors';
import mng from 'mongoose';

let PUBLIC_KEY: string, PRIVATE_KEY: string;
try {
  PUBLIC_KEY = fs.readFileSync(
    path.join(__dirname, '../keys/public.key'),
    'utf8'
  );
  PRIVATE_KEY = fs.readFileSync(
    path.join(__dirname, '../keys/private.key'),
    'utf8'
  );
} catch (err) {
  throw new Error('Error in reading key.');
}

type Payload = {
  _id: string | mng.Types.ObjectId;
  [k: string]: any;
};

/**
 * Decodes a JWT token to get payload
 *
 * @param {string} token JWT token
 * @returns Payload of the token
 */
export const decodeToken = (token: string): Payload => {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    });
    return <Payload>decoded;
  } catch (err) {
    throw new AuthorizationError('Missing or invalid token.');
  }
};

/**
 * Creates a JWT token with given payload
 *
 * @param {Payload} payload Payload of the token
 * @returns JWT token string
 */
export const generateToken = (payload: Payload): string => {
  const token = jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
  });
  return token;
};
