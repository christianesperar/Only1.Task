export enum Permission {
  ReadPosts = 'Read Posts',
  WritePosts = 'Write Posts',
  ReadMessages = 'Read Messages',
  WriteMessages = 'Write Messages',
  ReadProfileInfo = 'Read Profile Info',
  WriteProfileInfo = 'Write Profile Info',
}

export enum Status {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

export interface Invitation {
  id: string
  inviterId: string
  inviteeId: string
  permissions: Permission[]
  status: Status
  createdAt: string
  acceptedAt?: string | null
}
