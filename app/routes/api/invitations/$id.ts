import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import * as fs from 'fs'
import { parse } from 'cookie'

import { DbPath } from '@app/types/api'
import { Invitation } from '@app/types/invitation'

export const Route = createAPIFileRoute('/api/invitations/$id')({
  DELETE: async ({ request, params }) => {
    try {
      const cookies = parse(request.headers.get('cookie') || '')
      const { id } = params

      if (!id) {
        return json({ message: 'Invitation ID is required' }, { status: 400 })
      }

      const fileResponse = await fs.promises.readFile(
        DbPath.Invitations,
        'utf-8',
      )

      const invitations = JSON.parse(fileResponse) as Invitation[]

      const invitationFound = invitations.find(
        (invitation) => invitation.id === id,
      )

      if (!invitationFound) {
        return json({ message: 'Invitation not found' }, { status: 404 })
      }

      if (invitationFound.inviterId !== cookies['authToken']) {
        return json(
          { message: 'You are not authorized to delete this invitation' },
          { status: 403 },
        )
      }

      const updatedInvitations = invitations.filter(
        (invitation) => invitation.id !== id,
      )

      await fs.writeFileSync(
        DbPath.Invitations,
        JSON.stringify(updatedInvitations, null, 2),
      )

      return json({ success: true })
    } catch (err) {
      console.error('Error:', err)

      if (err instanceof Error) {
        return json({ message: err.message }, { status: 400 })
      }

      return json({ message: 'An unexpected error occurred' }, { status: 500 })
    }
  },
})
