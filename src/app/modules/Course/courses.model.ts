import { Schema, model } from "mongoose";
import { TCourse, TCourseDetails, TCourseTags } from "./courses.interface";

const courseTagsSchema = new Schema<TCourseTags>(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const courseDetailsSchema = new Schema<TCourseDetails>({
  level: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: {
    type: [courseTagsSchema],
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  durationInWeeks: {
    type: Number,
  },
  details: {
    type: courseDetailsSchema,
  },
});

// Calculating the durationInWeeks if not provided
courseSchema.pre("save", async function (next) {
  if (this.startDate && this.endDate && !this.durationInWeeks) {
    const startTime = new Date(this.startDate as string);
    const endTime = new Date(this.endDate as string);
    const difference = endTime.getTime() - startTime.getTime();
    this.durationInWeeks = Math.ceil(difference / (7 * 24 * 60 * 60 * 1000));
  }
  next();
});

export const Course = model<TCourse>("Course", courseSchema);
