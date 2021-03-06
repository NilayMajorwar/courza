import Student, { IStudent } from '../models/student';
import { NotFoundError } from '../utils/errors';

/**
 * Finds and returns Student object by ID
 */
export const get = async (studentId: string): Promise<IStudent> => {
  const student = await Student.findById(studentId);
  if (!student) throw new NotFoundError('Student does not exist.');
  return student;
};

/**
 * Update settings of student
 */
export const updateSettings = async (
  student: IStudent,
  patches: {}
): Promise<IStudent> => {
  student.settings = { ...student.settings, ...patches };
  await student.save();
  return student;
};
