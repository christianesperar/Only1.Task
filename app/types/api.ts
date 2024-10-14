import { User } from './user'
import { Invitation } from './invitation'

export enum DbPath {
  Invitations = 'app/db/invitations.json',
  Users = 'app/db/users.json',
}

export interface LoginResponse {
  token: string
}

export enum InvitationFilterBy {
  Inviter = 'inviter',
  Invitee = 'invitee',
}

export interface InvitationResponse extends Invitation {
  inviterEmail?: string
  inviteeEmail?: string
}

export type UserResponse = Omit<User, 'password'>

export interface DeleteInvitationParams {
  id: string
}
