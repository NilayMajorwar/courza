import mng from 'mongoose';

// Document interface
export interface IEnrolment extends mng.Document {
  _id: mng.Types.ObjectId;
  student: mng.Types.ObjectId;
  course: mng.Types.ObjectId;
}

// Statics interface
interface IStatics extends mng.Model<IEnrolment> {}

// Database schema
const enrolmentSchema = new mng.Schema<IEnrolment>(
  {
    student: {
      type: mng.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    course: {
      type: mng.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
  },
  { timestamps: true }
);

// Create compound unique index of student and course IDs
enrolmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrolment = mng.model<IEnrolment, IStatics>('Enrolment', enrolmentSchema);
export default Enrolment;
