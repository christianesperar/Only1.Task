import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  Button,
  Label,
  TextField,
  Input,
  Form,
  FieldError,
} from 'react-aria-components'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

import { LoginResponse } from '@app/types/api'
import { loginSchema, LoginData } from '@app/schemas/login'

import { useAuth } from '@app/hooks/useAuth'
import ProgressCircle from '@app/components/ProgressCircle'

const queryClient = new QueryClient()

export const Route = createFileRoute('/')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>
  )
}

function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: (formData: LoginData) => {
      return axios.post<LoginResponse>('/api/login', formData, {
        withCredentials: true,
      })
    },
    onSuccess: (response) => {
      login(response.data.token)
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      navigate({ to: '/invitations' })
    },
  })

  const { control, handleSubmit } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="mt-24 flex justify-center">
      <div className="flex flex-col items-center [&_.react-aria-TextField]:w-full">
        <h1 className="text-3xl mb-6">Login to Only1.Task</h1>

        <Form onSubmit={handleSubmit(onSubmit)}>
          {loginMutation.isError && (
            <div role="alert" tabIndex={-1} ref={(e) => e?.focus()}>
              <h3>Login Failed</h3>
              <p>User not found in our system, please try again.</p>
            </div>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} isInvalid={fieldState.invalid}>
                <Label>Email</Label>
                <Input ref={field.ref} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="password"
                isInvalid={fieldState.invalid}
              >
                <Label>Password</Label>
                <Input ref={field.ref} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </TextField>
            )}
          />

          <div className="w-full [&>button]:w-full">
            <Button
              type="submit"
              isPending={loginMutation.isPending}
              isDisabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <ProgressCircle
                  className="py-0.5 flex justify-center"
                  aria-label="Loading…"
                  isIndeterminate
                />
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
