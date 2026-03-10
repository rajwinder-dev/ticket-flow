import z from "zod";

export const onboardUserInput = {
  bodySchema: z
    .object({
      user: z.object({
        username: z.string(),
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
export type OnBoardUserInput = z.infer<typeof onboardUserInput.bodySchema>;
