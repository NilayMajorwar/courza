// @flow
import { pick } from 'lodash';
import Student, { IStudent } from '../models/student';
import Course, { ICourse } from '../models/course';
import Chat from '../models/chat';
import { hash, compareHash } from '../utils/base';
import * as CourseService from './courseService';
import { NotFoundError, CredentialsError } from '../utils/errors';

/**
 * Creates new student object in database
 *
 * @param {Object} data Object containing name, iitkEmail, rollNo and password
 * @returns {Promise<IStudent>} Newly created student object
 */
export const create = async (data: {
  name: string;
  iitkEmail: string;
  rollNo: number;
  password: string;
}): Promise<IStudent> => {
  const hashedPwd = await hash(data.password);
  const student = new Student({ ...data, password: hashedPwd });
  await student.save();
  return student;
};

/**
 * Finds and returns Student object by ID
 *
 * @param {string} studentId ID of the student
 * @returns {Promise<Student>} Student object
 */
export const get = async (studentId: string): Promise<IStudent> => {
  const student = await Student.findById(studentId);
  if (!student) throw new NotFoundError('Student does not exist.');
  return student;
};

/**
 * Checks if given credentials are correct, and returns student object if so
 *
 * @param {string} iitkEmail IITK email ID
 * @param {string} password Plaintext password
 * @returns {Student} Student object (or null, if password does not match)
 */
export const login = async (
  iitkEmail: string,
  password: string
): Promise<IStudent> => {
  const student = await Student.findOne({ iitkEmail });
  if (!student) throw new NotFoundError('Student does not exist.');
  const match = await compareHash(password, student.password);
  if (!match) throw new CredentialsError('Password does not match.');
  return student;
};

/**
 * Generates OAuth token for given student object
 *
 * @param {Student} student Student object
 * @returns {string} OAuth token for the student
 */
export const createToken = (student: IStudent): string => {
  const token = student.generateToken();
  return token;
};

/**
 * Adds student to course (updates course object)
 *
 * @param {Student} student Student object to be added
 * @param {Course} course Course to add the student to
 * @returns {Student} Updated student object
 */
export const joinCourse = async (
  student: IStudent,
  course: ICourse
): Promise<IStudent> => {
  await CourseService.addNewStudent(course, student);
  student.courses.push(course._id);
  await student.save();
  return student;
};

/**
 * Returns basic info of the student, including course list
 *
 * @param {Student} student Student object
 * @returns {Object} Basic info, with courses' info
 */
export const getProfile = async (student: IStudent) => {
  const courses = await Course.find({ _id: { $in: student.courses } }).lean();
  const plainCourses = courses.map((c) => pick(c, ['_id', 'name', 'code']));
  return {
    ...pick(student, ['_id', 'name', 'iitkEmail', 'rollNo']),
    courses: plainCourses,
  };
};

/**
 * Returns user profile, with information of all courses and chats.
 * Used for information needed at app startup
 *
 * @param {Student} student Student object
 * @returns {Object} Profile with course and chat info included
 */
export const getFullProfile = async (student: IStudent) => {
  const rawCourses = await Course.find({
    _id: { $in: student.courses },
  }).lean();
  const courses = [];
  for (const c of rawCourses) {
    const course = pick(c, ['_id', 'name', 'code']);
    // @ts-ignore
    course.chats = await Chat.find({ _id: { $in: c.chats } });
    courses.push(course);
  }
  return {
    ...pick(student, ['_id', 'name', 'iitkEmail', 'rollNo']),
    courses,
  };
};