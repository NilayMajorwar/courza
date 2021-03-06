import bcrypt from 'bcrypt';
import { IITK_EMAIL_REGEX } from './constants';
import { Types } from 'mongoose';

/**
 * Simple function to easily create descriptive errors
 *
 * @param {string} errorName Name of the error
 * @param {string} errorMessage Error message
 * @returns Error object with given name and message
 */
export const error = (errorName: string, errorMessage: string): Error => {
  const err = new Error();
  err.name = errorName;
  err.message = errorMessage;
  return err;
};

/**
 * Get username from IITK email id
 *
 * @param {string} email Email id to be parsed
 * @returns Username of the email id
 *
 */
export const getUsernameFromEmail = (email: string): string => {
  // Capture username and subdomain from given email
  const groups = email.match(IITK_EMAIL_REGEX);
  if (groups === null)
    throw error('EmailError', 'Email is not a valid IITK email ID.');
  const username = groups[1];
  return username;
};

/**
 * Hashes the given string
 *
 * @param {string} str String to be hashed
 * @returns Promise that resolves with hashed string
 */
export const hash = async (str: string): Promise<string> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(str, saltRounds);
  return hash;
};

/**
 * Compares plaintext string with a hash, and returns result
 *
 * @param {string} str Plaintext string
 * @param {string} hash Hash to compare to
 * @returns Promise that resolves to true, if compare succeeds
 */
export const compareHash = async (
  str: string,
  hash: string
): Promise<boolean> => {
  const match = await bcrypt.compare(str, hash);
  return match;
};

/**
 * Converts a valid string to a Mongoose ObjectID
 *
 * @param {string} str String to be converted to ObjectID
 * @returns ObjectID corresponding to the string
 */
export const toObjectID = (str: string): Types.ObjectId => {
  return new Types.ObjectId(str);
};
