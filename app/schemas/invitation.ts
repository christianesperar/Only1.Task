import { z } from 'zod'

import { Permission } from '@app/types/invitation'

export const invitationSchema = z.object({
  inviteeId: z
    .string({
      required_error: 'Invitee is required',
    })
    .min(1, 'Invitee is required'),
  permissions: z
    .array(z.nativeEnum(Permission))
    .nonempty('At least one permission is required'),
})

export type InvitationData = z.infer<typeof invitationSchema>
