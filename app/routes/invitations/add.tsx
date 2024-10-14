import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Button,
  Form,
  FieldError,
  Dialog,
  DialogTrigger,
  Modal,
} from 'react-aria-components'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'

import { UserResponse } from '@app/types/api'
import { invitationSchema, InvitationData } from '@app/schemas/invitation'

import { useAuth } from '@app/hooks/useAuth'
import ProtectedRoute from '@app/components/ProtectedRoute'
import ButtonTransparent from '@app/components/ButtonTransparent'
import SwitchPermissions from '@app/components/SwitchPermissions'
import ProgressCircle from '@app/components/ProgressCircle'
import { axiosServer } from '@app/helpers'

const fetchUsers = createServerFn('GET', async () => {
  const usersResponse = await axiosServer().get<UserResponse[]>(`/api/users`)

  return {
    users: usersResponse.data,
  }
})

export const Route = createFileRoute('/invitations/add')({
  component: () => (
    <ProtectedRoute>
      <ManageInvitesPage />
    </ProtectedRoute>
  ),
  loader: async () => await fetchUsers(),
})

const queryClient = new QueryClient()

function ManageInvitesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AddForm />
    </QueryClientProvider>
  )
}

function AddForm() {
  const { getUserToken } = useAuth()
  const state = Route.useLoaderData()
  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)

  const addMutation = useMutation({
    mutationFn: (formData: InvitationData) => {
      return axios.post('/api/invitations', formData, { withCredentials: true })
    },
    onSuccess: () => {
      navigate({ to: '/invitations' })
    },
  })

  const { control, handleSubmit, getValues } = useForm<InvitationData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      inviteeId: '',
      permissions: [],
    },
  })

  const onSubmit = () => {
    setShowConfirmation(true)
  }

  const handleProceed = () => {
    setShowConfirmation(false)
    addMutation.mutate(getValues())
  }

  return (
    <>
      <div className="mt-24 flex justify-center">
        <div className="flex flex-col items-center [&_.react-aria-TextField]:w-full">
          <h1 className="text-3xl mb-6">Invite Users</h1>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {addMutation.isError && (
              <div role="alert" tabIndex={-1}>
                <h3>Invite Failed</h3>
                <p>User already invited.</p>
              </div>
            )}

            <Controller
              name="inviteeId"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <ComboBox
                    {...field}
                    onSelectionChange={field.onChange}
                    isInvalid={fieldState.invalid}
                  >
                    <Label>Email</Label>

                    <div>
                      <Input />
                      <Button>▼</Button>
                    </div>
                    <Popover>
                      <ListBox>
                        {state.users
                          .filter(({ id }) => id !== getUserToken())
                          .map((item) => (
                            <ListBoxItem id={item.id} key={item.id}>
                              {item.email}
                            </ListBoxItem>
                          ))}
                      </ListBox>
                    </Popover>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </ComboBox>
                </>
              )}
            />

            <Controller
              name="permissions"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <SwitchPermissions
                    selectedPermissions={field.value}
                    isInvalid={fieldState.invalid}
                    onChange={field.onChange}
                  >
                    {/* <FieldError /> alternative */}
                    <>{fieldState.error?.message}</>
                  </SwitchPermissions>
                </>
              )}
            />

            <div className="w-full flex justify-between items-center">
              <ButtonTransparent
                onPress={() => navigate({ to: '/invitations' })}
              >
                Back
              </ButtonTransparent>
              <Button
                type="submit"
                isPending={addMutation.isPending}
                isDisabled={addMutation.isPending}
              >
                {addMutation.isPending ? (
                  <ProgressCircle
                    className="py-0.5 flex justify-center"
                    aria-label="Loading…"
                    isIndeterminate
                  />
                ) : (
                  'Invite User'
                )}
              </Button>
            </div>
          </Form>

          <DialogTrigger isOpen={showConfirmation}>
            <Modal>
              <Dialog role="alertdialog">
                <>
                  <p className="mb-2">Are you sure you want to proceed?</p>
                  <p>
                    This will invite{' '}
                    <strong>
                      {
                        state.users.find(
                          ({ id }) => id === getValues('inviteeId'),
                        )?.email
                      }
                    </strong>{' '}
                    with following permission(s):
                  </p>
                  <ul className="mb-4">
                    {getValues('permissions').map((permission) => (
                      <li key={permission}>
                        - <span className="font-semibold">{permission}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-end gap-1">
                    <ButtonTransparent
                      onPress={() => setShowConfirmation(false)}
                    >
                      Cancel
                    </ButtonTransparent>

                    <Button onPress={handleProceed}>Proceed</Button>
                  </div>
                </>
              </Dialog>
            </Modal>
          </DialogTrigger>
        </div>
      </div>
    </>
  )
}
