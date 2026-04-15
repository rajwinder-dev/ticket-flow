import { z } from "zod";
import { validDescription, validEmail, validPhoneNo, validString } from "./helper/zodHelper.js";

export const createTeamMemberInput = {
  bodySchema: z
    .object({
      username: validString,
      email: validEmail, // Automatically trims and lowercases
      phoneNo: validPhoneNo,
      avatar: z.url("Invalid avatar URL").optional(),
      gender: z.enum(["male", "female", "other"], { message: "Please select a valid gender" }),
      location: validString,
      roleId: z.string().uuid("Invalid Role ID"),
    })
    .strict(),
};

export const updateTeamMemberInput = {
  bodySchema: z
    .object({
      username: validString.optional(),
      email: validEmail.optional(),
      phoneNo: validPhoneNo.optional(), // Fixed naming: changed phoneNumber to phoneNo
      location: validString.optional(),
      avatar: z.string().url("Invalid avatar URL").optional(),
      jobTitle: validString.optional(),
      description: validDescription.optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
    })
    .strict(),
};

// --- Inferred Types ---
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberInput.bodySchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberInput.bodySchema>;
