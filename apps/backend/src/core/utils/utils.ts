/* eslint-disable @typescript-eslint/no-explicit-any */
// found this function on internet, typescript is too genetic

import path from "path";
import fs from "fs";
import { customAlphabet } from "nanoid";
/**
 * this recursive function used to remove files for nested object ,
 * found this function on internet
 * @param {object} obj
 * @param {string[]} [keyToRemove=[]]
 * @return {*}  {object}
 */
export function deepStrip(obj: object, keyToRemove: string[] = []): object {
  if (obj instanceof Date) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepStrip(item, keyToRemove));
  } else if (obj && typeof obj === "object") {
    const newObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!keyToRemove.includes(key)) {
        newObj[key] = deepStrip(value, keyToRemove);
      }
    }
    return newObj;
  }
  return obj;
}
// build to delete upload files
export function deleteUploadedFilesLocal(filePaths: string[]) {
  filePaths.forEach((filePath) => {
    if (!filePath) return;

    const fullPath = path.resolve(
      process.cwd(),
      "uploads",
      path.basename(filePath)
    );
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Error deleting file:", err.message);
      else console.log("Deleted file due to error:", filePath);
    });
  });
}
const nanoid = customAlphabet("1234567890", 6)

export function readableId(preFlex:string) {
  return ` ${preFlex}-${nanoid()}`
}
export const deepNormalize = (obj: any, excludeFields: string[] = []): any => {
  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? obj.trim() : obj;
  }
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => deepNormalize(item, excludeFields));
  }
  return Object.keys(obj).reduce((acc: any, key) => {
    const value = obj[key];

    // Check if this specific key should be ignored by the normalizer
    if (excludeFields.includes(key)) {
      // KEEP AS IS: No trimming, no recursion into this specific value
      acc[key] = value;
    } else {
      // NORMALIZE: Trim strings and recurse into nested objects
      acc[key] = deepNormalize(value, excludeFields);
    }

    return acc;
  }, {});
};
