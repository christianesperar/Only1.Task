import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import * as fs from 'fs'
import argon2 from 'argon2'

import { DbPath } from '@app/types/api'
import { User } from '@app/types/user'
import { loginSchema, LoginData } from '@app/schemas/login'

export const Route = createAPIFileRoute('/api/login')({
  POST: async ({ request }) => {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })

      const body = (await request.json()) as LoginData
      const validatedData = loginSchema.parse(body)

      const fileResponse = await fs.promises.readFile(DbPath.Users, 'utf-8')

      const users = JSON.parse(fileResponse) as User[]

      const userFound = users.find(({ email }) => email === validatedData.email)

      if (userFound) {
        const isPasswordValid = await argon2.verify(
          userFound.password,
          validatedData.password,
        )

        if (isPasswordValid) {
          // Fake login response for demonstration purposes
          return json({ token: userFound.id })
        }
      }

      throw new Error('Invalid credentials.')
    } catch (err) {
      console.error('Error:', err)

      if (err instanceof Error) {
        return json({ message: err.message }, { status: 400 })
      }

      return json({ message: 'An unexpected error occurred' }, { status: 500 })
    }
  },
})
