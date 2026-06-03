import { z } from "zod";
export declare const validUuidParams: {
    paramsSchema: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strict>;
};
export declare const cryptoType: z.ZodObject<{
    iv: z.ZodString;
    content: z.ZodString;
    tag: z.ZodString;
}, z.core.$strip>;
export type CryptoType = z.infer<typeof cryptoType>;
//# sourceMappingURL=global.zod.d.ts.map