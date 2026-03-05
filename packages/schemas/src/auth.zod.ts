import { z } from "zod"

export const CreateTicketSchema = z.object({
  title: z.string(),
  description: z.string()
})

export type CreateTicket = z.infer<typeof CreateTicketSchema>
