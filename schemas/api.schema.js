import { z } from "zod";
import { keysToCamel } from "@/utils/case";

export const paginationMetaSchema = z.object({
  count: z.number().optional(),
  next: z.string().nullable().optional(),
  previous: z.string().nullable().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  totalPages: z.number().optional(),
});

export const apiListSchema = z.object({
  results: z.array(z.unknown()),
  count: z.number().optional(),
  next: z.string().nullable().optional(),
  previous: z.string().nullable().optional(),
});

export const apiMessageSchema = z.object({
  detail: z.string().optional(),
  message: z.string().optional(),
  code: z.union([z.string(), z.number()]).optional(),
});

export function parseApiData(schema, data) {
  return schema.parse(keysToCamel(data));
}

export function safeParseApiData(schema, data) {
  return schema.safeParse(keysToCamel(data));
}
