import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { parse } from 'cookie'

import { DbPath } from '@app/types/api'
import { Invitation, Status } from '@app/types/invitation'
import { User } from '@app/types/user'
import { InvitationFilterBy, InvitationResponse } from '@app/types/api'
import { invitationSchema, InvitationData } from '@app/schemas/invitation'

export const Route = createAPIFileRoute('/api/invitations')({
  GET: async ({ request }) => {
    try {
      const cookies = parse(request.headers.get('cookie') || '')
      const url = new URL(request.url)
      const filterBy = url.searchParams.get(
        'filterBy',
      ) as InvitationFilterBy | null

      const [invitationsResponse, usersResponse] = await Promise.all([
        fs.promises.readFile(DbPath.Invitations, 'utf-8'),
        fs.promises.readFile(DbPath.Users, 'utf-8'),
      ])

      const invitations = JSON.parse(invitationsResponse) as Invitation[]
      const users = JSON.parse(usersResponse) as User[]

      const getUserEmailById = (id: string) =>
        users.find((user) => user.id === id)?.email

      const invitationsFound: InvitationResponse[] = invitations
        .filter(({ inviterId, inviteeId }) => {
          switch (filterBy) {
            case InvitationFilterBy.Inviter:
              return inviterId === cookies['authToken']
            case InvitationFilterBy.Invitee:
              return inviteeId === cookies['authToken']
            default:
              return true
          }
        })
        .map((invitation) => {
          return {
            ...invitation,
            inviterEmail: getUserEmailById(invitation.inviterId),
            inviteeEmail: getUserEmailById(invitation.inviteeId),
          }
        })

      return json(invitationsFound)
    } catch (err) {
      console.error('Error:', err)

      if (err instanceof Error) {
        return json({ message: err.message }, { status: 400 })
      }

      return json({ message: 'An unexpected error occurred' }, { status: 500 })
    }
  },
  POST: async ({ request }) => {
    try {
      const cookies = parse(request.headers.get('cookie') || '')
      const body = (await request.json()) as InvitationData
      const validatedData = invitationSchema.parse(body)

      const fileResponse = await fs.promises.readFile(
        DbPath.Invitations,
        'utf-8',
      )

      const invitations = JSON.parse(fileResponse) as Invitation[]

      const userFound = invitations.find(
        ({ inviterId, inviteeId }) =>
          inviterId === cookies['authToken'] &&
          inviteeId === validatedData.inviteeId,
      )

      if (userFound) {
        return json(
          { message: 'User already has an invitation' },
          { status: 400 },
        )
      }

      const newInvitation = {
        ...validatedData,
        id: uuidv4(),
        inviterId: cookies['authToken'] as string,
        status: Status.Pending,
        createdAt: new Date().toISOString(),
      }

      invitations.push(newInvitation)

      await fs.writeFileSync(
        DbPath.Invitations,
        JSON.stringify(invitations, null, 2),
      )

      return json(newInvitation)
    } catch (err) {
      console.error('Error:', err)

      if (err instanceof Error) {
        return json({ message: err.message }, { status: 400 })
      }

      return json({ message: 'An unexpected error occurred' }, { status: 500 })
    }
  },
})
