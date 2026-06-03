import { z } from "zod";
export declare const createTeamMemberInput: {
    bodySchema: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodEmail;
        phoneNo: z.ZodString;
        avatar: z.ZodOptional<z.ZodURL>;
        gender: z.ZodEnum<{
            other: "other";
            male: "male";
            female: "female";
        }>;
        location: z.ZodString;
        roleId: z.ZodString;
    }, z.core.$strict>;
};
export declare const updateTeamMemberInput: {
    bodySchema: z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodEmail>;
        phoneNo: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
        jobTitle: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodEnum<{
            other: "other";
            male: "male";
            female: "female";
        }>>;
    }, z.core.$strict>;
};
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberInput.bodySchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberInput.bodySchema>;
//# sourceMappingURL=team.zod.d.ts.map