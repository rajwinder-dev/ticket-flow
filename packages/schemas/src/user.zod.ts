import z from "zod";
import { validPhoneNo } from "./helper/zodHelper";

export const onboardUserInput = {
  bodySchema: z
    .object({
      user: z.object({
        location: z.string().optional(),
      }),
      organization: z.object({
        name: z.string(),
        description: z.string().optional(),
        teamSize: z.number(),
      }),
    })
    .strict(),
};
export const updateMyDetailsInput = {
  bodySchema: z
    .object({
      phoneNo: validPhoneNo.optional(),
      avatar: z.url().optional(),
      gender: z.enum(["male", "female", "other"]).optional(),
      location: z.string().optional(),
    })
    .strict(),
};
export type UpdateUserInput = z.infer<typeof updateMyDetailsInput.bodySchema>
export type OnBoardUserInput = z.infer<typeof onboardUserInput.bodySchema>;







