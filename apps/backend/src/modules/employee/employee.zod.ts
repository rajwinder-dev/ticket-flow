import {
  validBigDescription,
  validId,
  validPhoneNo,
  validString,
  validTimestamp,
} from "../../core/helper/zodHelper";
import { z } from "zod";

export const employeeSchema = {
  bodySchema: z
    .object({
      uuid: z.string().min(6).max(20),
      firstName: validString,
      lastName: validString,
      email: z.string().email(),
      phoneNumber: validPhoneNo,
      dateOfBirth: validTimestamp,
      gender: z.enum(["male", "female", "other"]),
      address: validBigDescription,
      jobTitle: validString,
      hireDate: validTimestamp,
      description: z.string().optional(),
      nationalId: z.string(),
      idType: z.string(),
      filePath: z.string().optional(),
      image: z.string().url().optional(),
      departmentId: z.number(),
    })
    .strict(),
};

export const employeeUpdateSchema = {
  bodySchema: z
    .object({
      email: z.string().email().optional(),
      phoneNumber: validPhoneNo.optional(),
      address: validBigDescription.optional(),
      image: z.string().url().optional(),
      jobTitle: z.string().optional(),
      description: z.string().optional(),
    })
    .strict(),
  paramsSchema: z
    .object({
      id: validId,
    })
    .strict(),
};

export const updateMyDetails = {
  bodySchema: z
    .object({
      email: z.string().email().optional(),
      phoneNumber: validPhoneNo.optional(),
      address: validBigDescription.optional(),
      image: z.string().url().optional(),
    })
    .strict(),
};
