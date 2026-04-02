import { z } from "zod";
import { validBigDescription, validPhoneNo, validString } from "./helper/zodHelper";

export const onboardUserInput = {
  bodySchema: z
    .object({
      user: z.object({
        // Using validString to ensure location isn't just whitespace
        location: validString.optional(),
      }),
      organization: z.object({
        name: validString,
        description: validBigDescription.optional(),
        // Ensuring team size is a realistic positive integer
        teamSize: z.number().int().nonnegative("Team size cannot be negative"),
      }),
    })
    .strict(),
};

export const updateMyDetailsInput = {
  bodySchema: z
    .object({
      phoneNo: validPhoneNo.optional(),
      avatar: z.url("Please provide a valid image URL").optional(),
      gender: z
        .enum(["male", "female", "other"], { message: "Select a valid gender option" })
        .optional(),
      location: validString.optional(),
    })
    .strict(),
};

export const userSchema = z
  .object({
    location: z.string().nullable(),
    phoneNo: z.string().nullable(),
    avatar: z.string().nullable(),
    id: z.string(),
    code: z.string(),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    email: z.email(),
    username: z.string().nullable(),
  })
  ;

// --- Inferred Types ---
export type UserSchema = z.infer<typeof userSchema>
export type UpdateMyDetailsInput = z.infer<typeof updateMyDetailsInput.bodySchema>;
export type OnBoardUserInput = z.infer<typeof onboardUserInput.bodySchema>;
