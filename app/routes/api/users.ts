import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import * as fs from 'fs'

import { DbPath } from '@app/types/api'
import { User } from '@app/types/user'

export const Route = createAPIFileRoute('/api/users')({
  GET: async () => {
    try {
      const fileResponse = await fs.promises.readFile(DbPath.Users, 'utf-8')

      const users = (JSON.parse(fileResponse) as User[]).map((user: User) => {
        const { password, ...rest } = user

        return rest
      })

      return json(users)
    } catch (err) {
      console.error('Error:', err)

      if (err instanceof Error) {
        return json({ message: err.message }, { status: 400 })
      }

      return json({ message: 'An unexpected error occurred' }, { status: 500 })
    }
  },
})
