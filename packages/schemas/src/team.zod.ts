import { z } from "zod";
import { validPhoneNo } from "./helper/zodHelper";

export const createTeamMemberInput = {
  bodySchema: z
    .object({
      email: z.email(),
      phoneNo: validPhoneNo,
      avatar: z.url().optional(),
      gender: z.enum(["male", "female", "other"]),
      username: z.string(),
      location: z.string(),
      roleId: z.uuid(),
    })
    .strict(),
};

export const updateTeamMemberInput = {
  bodySchema: z
    .object({
      email: z.email().optional(),
      phoneNumber: validPhoneNo.optional(),
      location: z.string().optional(),
      avatar: z.url().optional(),
      jobTitle: z.string().optional(),
      description: z.string().optional(),
    })
    .strict(),
};
