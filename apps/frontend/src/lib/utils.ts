/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * A recursive partial type to represent the subset of changed data.
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * Maps React Hook Form's `dirtyFields` over the form `data` to return only changed values.
 * * @param dirtyFields - The dirtyFields object from RHF formState.
 * @param allValues - The current form values (usually from handleSubmit).
 */
export function dirtyValues<T extends Record<string, any>>(
  dirtyFields: object | boolean,
  allValues: T,
): DeepPartial<T> {
  // If the field is a leaf node and is dirty, or if it's an array
  // (where we return the whole array per your logic), return the value.
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues as unknown as DeepPartial<T>;
  }

  // If it's not an object (or is null), it's not dirty/invalid context.
  if (typeof dirtyFields !== "object" || dirtyFields === null) {
    return {} as DeepPartial<T>;
  }

  // Construct the changed subset
  const entries = Object.keys(dirtyFields).map((key) => {
    const k = key as keyof T;
    const dirtyChild = (dirtyFields as any)[k];
    const valueChild = allValues[k];

    return [k, dirtyValues(dirtyChild, valueChild)];
  });

  return Object.fromEntries(entries) as DeepPartial<T>;
}
