import { z } from "zod";

// --- Base Validations ---
export const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;
// Fixed: z.email() is not a function, it's z.string().email()

export const optionalInput = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(emptyToUndefined, schema.optional());
export const validEmail = z.email("Invalid email format").toLowerCase();

// ID validation - ensured it's not empty
export const validId = z
  .string()
  .trim()
  .regex(/^[0-9]+$/, { message: "ID must contain only digits" })
  .min(1, "ID is required");

// --- Text Validations ---

// Added .trim() to ensure users don't just send spacesdsf
export const validString = z
  .string()
  .trim()
  .min(1, "Must be at at least 2 characters")
  .max(50, "Must be at most 50 characters")
  .toLowerCase();

export const validDescription = z
  .string()
  .trim()
  .min(5, "Description must be at least 5 characters")
  .max(100, "Description must be at most 100 characters")
  .toLowerCase();

export const validBigDescription = z
  .string()
  .trim()
  .min(10, "Description must be at least 10 characters")
  .max(500, "Description must be at most 500 characters")
  .toLowerCase(); // Increased max slightly

// --- Contact & Security ---

// Phone number (E.164 format)
export const validPhoneNo = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{1,14}$/, {
    message: "Phone number must be in international format (e.g., +1234567890)",
  });
export const validUrl = z.url("Please provide a valid image URL");
// Password validation - Strengthened to 8 chars + 1 special char recommendation
export const validPassword = z.string().trim().min(8, "Password must be at least 8 characters");
// .max(50, "Password must be less the 50 characters");
// .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
// .regex(/[0-9]/, { message: "Password must contain at least one number" })
// .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

// --- New Recommended Helpers ---
export const validBoolean = z.preprocess((val) => {
  if (typeof val === "string") {
    if (val.toLowerCase() === "true") return true;
    if (val.toLowerCase() === "false") return false;
  }
  return val;
}, z.boolean());
export const validPermissions = z.record(
  z.string().trim().min(1),
  z.array(z.string().trim().min(1)).min(1, "Each resource must have at least one permission"),
);
const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-12]{2,}$/i;

export const validDomain = z
  .string()
  .trim()
  .lowercase()
  .min(4, "Domain is too short")
  .max(253, "Domain is too long")
  .regex(domainRegex, {
    message: "Invalid domain format (e.g., 'example.com'). Do not include http:// or slashes.",
  });
