import { z } from "zod";

export const inAppNotificationSchema = z.object({
  id: z.string(),
  tenant_id: z.string(),
  user_id: z.string(),
  event_type: z.string(),
  title: z.string(),
  message: z.string(),
  is_read: z.boolean(),
  priority: z.enum(["low", "medium", "high"]),
  reference_type: z.string().nullable(),
  reference_id: z.string().nullable(),
  project_code: z.string().optional(),
  project_name: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const notificationListSchema = z.object({
  count: z.number(),
  results: z.array(inAppNotificationSchema),
});

export const unreadCountSchema = z.object({
  unread: z.number(),
});
