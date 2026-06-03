import { z } from "zod";
export declare const emptyToUndefined: (val: unknown) => unknown;
export declare const optionalInput: <T extends z.ZodTypeAny>(schema: T) => z.ZodPreprocess<z.ZodOptional<T>>;
export declare const validEmail: z.ZodEmail;
export declare const validId: z.ZodString;
export declare const validString: z.ZodString;
export declare const validDescription: z.ZodString;
export declare const validBigDescription: z.ZodString;
export declare const validPhoneNo: z.ZodString;
export declare const validUrl: z.ZodURL;
export declare const validPassword: z.ZodString;
export declare const validBoolean: z.ZodPreprocess<z.ZodBoolean>;
export declare const validPermissions: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
export declare const validDomain: z.ZodString;
//# sourceMappingURL=zodHelper.d.ts.map