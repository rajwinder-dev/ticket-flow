import { startOfDay } from "date-fns";
import { z } from "zod";

// ID must be a string of digits (e.g., "123")
export const validId = z
  .string()
  .regex(/^[0-9]+$/, { message: "ID must contain only digits" });

// Text validations
export const validString = z
  .string()
  .min(2, "Must be at least 2 characters")
  .max(50, "Must be at most 50 characters");

export const validDescription = z
  .string()
  .min(5, "Description must be at least 5 characters")
  .max(100, "Description must be at most 100 characters");

export const validBigDescription = z
  .string()
  .min(10, "Description must be at least 10 characters")
  .max(200, "Description must be at most 200 characters");

// Timestamp/date validations
export const validTimestamp = z.preprocess(
  (arg) => (typeof arg === "string" || typeof arg === "number" || arg instanceof Date ? new Date(arg) : arg),
  z.date({ required_error: "A valid date is required" })
);

export const validDeadline = validTimestamp.refine(
  (date) => date >= startOfDay(new Date()),
  {
    message: "Date must be today or in the future",
    path: ["startDate"], // Optional; remove if you want global message
  }
);

// Phone number (E.164 format)
export const validPhoneNo = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, { message: "Phone number must be in valid international format" });

// Password validation
export const validPassword = z
  .string()
  .min(4, "Password must be at least 4 characters")
  .max(18, "Password must be at most 18 characters");
