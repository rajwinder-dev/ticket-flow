import { z } from "zod";
export declare const createOrganizationInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<{
            PERSONAL: "PERSONAL";
            TEAM: "TEAM";
        }>;
        teamSize: z.ZodOptional<z.ZodNumber>;
        slug: z.ZodString;
    }, z.core.$strict>;
};
export declare const updateOrganizationInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodPreprocess<z.ZodOptional<z.ZodString>>;
        logo: z.ZodPreprocess<z.ZodOptional<z.ZodURL>>;
        slug: z.ZodString;
        teamSize: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
};
export declare const inviteUserOrganizationInput: {
    bodySchema: z.ZodObject<{
        email: z.ZodEmail;
        roleId: z.ZodUUID;
    }, z.core.$strict>;
};
export declare const createOrganizationResponse: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodNullable<z.ZodString>;
    slug: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const membershipSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    userId: z.ZodString;
    roleId: z.ZodString;
}, z.core.$strip>;
export declare const organizationSchemaResponse: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    teamSize: z.ZodNullable<z.ZodNumber>;
    slug: z.ZodNullable<z.ZodString>;
    code: z.ZodString;
    type: z.ZodNullable<z.ZodString>;
    active: z.ZodBoolean;
    logo: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    createdBy: z.ZodUUID;
}, z.core.$strip>;
export declare const memberSchemaResponse: z.ZodObject<{
    id: z.ZodUUID;
    userId: z.ZodUUID;
    email: z.ZodNullable<z.ZodEmail>;
    name: z.ZodNullable<z.ZodString>;
    avatar: z.ZodNullable<z.ZodString>;
    role: z.ZodNullable<z.ZodString>;
    roleId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedDate<unknown>;
    organizationId: z.ZodUUID;
    totalTickets: z.ZodOptional<z.ZodNumber>;
    queues: z.ZodNullable<z.ZodArray<z.ZodObject<{
        queueId: z.ZodNullable<z.ZodString>;
        name: z.ZodNullable<z.ZodString>;
        ticketCount: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const inviteMemberDetailsResponse: z.ZodObject<{
    organization: z.ZodString;
    role: z.ZodString;
    invitedTo: z.ZodString;
    invitedBy: z.ZodString;
    expiresAt: z.ZodDate;
}, z.core.$strip>;
export declare const onboardingStatusSchema: z.ZodObject<{
    hasRoles: z.ZodBoolean;
    hasGroups: z.ZodBoolean;
    hasQueues: z.ZodBoolean;
    hasInvites: z.ZodBoolean;
    hasEmail: z.ZodBoolean;
    currentStep: z.ZodNumber;
}, z.core.$strip>;
export type CreateOrganizationResponse = z.infer<typeof createOrganizationResponse>;
export type OrganizationSchemaResponse = z.infer<typeof organizationSchemaResponse>;
export type MemberSchemaResponse = z.infer<typeof memberSchemaResponse>;
export type InviteMemberDetailsResponse = z.infer<typeof inviteMemberDetailsResponse>;
export type OnboardingStatusResponse = z.infer<typeof onboardingStatusSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput.bodySchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationInput.bodySchema>;
export type InviteUserOrganizationInput = z.infer<typeof inviteUserOrganizationInput.bodySchema>;
//# sourceMappingURL=organization.zod.d.ts.map