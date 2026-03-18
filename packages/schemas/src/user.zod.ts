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
      email: z.email(),
      phoneNo: validPhoneNo,
      avatar: z.url().optional(),
      gender: z.enum(["male", "female", "other"]),
      username: z.string(),
      location: z.string(),
    })
    .strict(),
};
export type updateUser = z.infer<typeof updateMyDetailsInput.bodySchema>
export type OnBoardUserInput = z.infer<typeof onboardUserInput.bodySchema>;
