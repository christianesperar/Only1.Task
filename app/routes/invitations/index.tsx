import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  ResizableTableContainer,
} from 'react-aria-components'
import axios from 'axios'

import { Status } from '@app/types/invitation'
import { InvitationResponse } from '@app/types/api'

import ProtectedRoute from '@app/components/ProtectedRoute'
import ButtonTransparent from '@app/components/ButtonTransparent'
import SwitchPermissions from '@app/components/SwitchPermissions'
import { axiosServer } from '@app/helpers'

const fetchInvitations = createServerFn('GET', async () => {
  const invitationsByInviterResponse = await axiosServer().get(
    '/api/invitations?filterBy=inviter',
  )
  const invitationsByInviteeResponse = await axiosServer().get(
    '/api/invitations?filterBy=invitee',
  )

  return {
    invitationsByInviter:
      invitationsByInviterResponse.data as InvitationResponse[],
    invitationsByInvitee:
      invitationsByInviteeResponse.data as InvitationResponse[],
  }
})

export const Route = createFileRoute('/invitations/')({
  component: () => (
    <ProtectedRoute>
      <ManageInvitesPage />
    </ProtectedRoute>
  ),
  loader: async () => await fetchInvitations(),
})

const queryClient = new QueryClient()

function ManageInvitesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <InvitationList />
    </QueryClientProvider>
  )
}

function InvitationList() {
  const navigate = useNavigate()
  const state = Route.useLoaderData()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [itemToDelete, setItemToDelete] = useState<string>('')

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.delete(`/api/invitations/${id}`, { withCredentials: true })
    },
    onSuccess: () => {
      navigate({ to: '/invitations' })
    },
  })

  const handleDelete = async (id: string) => {
    setItemToDelete(id)
    deleteMutation.mutate(id)
  }

  const handleToggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <>
      <Tabs>
        <TabList aria-label="Manage Invites">
          <Tab id="given">Given</Tab>
          <Tab id="received">Received</Tab>
        </TabList>

        <TabPanel id="given">
          <div className="mb-4 flex justify-end">
            <Button
              className="react-aria-Button"
              onPress={() => navigate({ to: '/invitations/add' })}
            >
              Invite User
            </Button>
          </div>

          {/* Use ResizableTableContainer as I am unable to adjust the width of the Table component for some reason */}
          <ResizableTableContainer>
            <Table aria-label="Invitations" selectionMode="multiple">
              <TableHeader>
                <Column isRowHeader>Invitee</Column>
                <Column>Invited On</Column>
                <Column width={90}>Status</Column>
                <Column width={122}>Actions</Column>
              </TableHeader>
              <TableBody renderEmptyState={() => 'No results found.'}>
                {state.invitationsByInviter.map((item) => (
                  <React.Fragment key={item.id}>
                    <Row>
                      <Cell>{item.inviteeEmail}</Cell>
                      <Cell>{item.createdAt}</Cell>
                      <Cell>{item.status}</Cell>
                      <Cell>
                        <div className="flex justify-end">
                          {[Status.Pending, Status.Accepted].includes(
                            item.status,
                          ) && (
                            <span className="mr-1">
                              <Button
                                isPending={
                                  !!itemToDelete && deleteMutation.isPending
                                }
                                isDisabled={
                                  !!itemToDelete && deleteMutation.isPending
                                }
                                onPress={() => handleDelete(item.id)}
                              >
                                Delete
                              </Button>
                            </span>
                          )}
                          <ButtonTransparent
                            borderless
                            onPress={() => handleToggleRow(item.id)}
                          >
                            {expandedRows.has(item.id) ? '▲' : '▼'}
                          </ButtonTransparent>{' '}
                        </div>
                      </Cell>
                    </Row>
                    {expandedRows.has(item.id) && (
                      <Row className="relative h-[200px]">
                        <Cell className="absolute">
                          <div className="p-4 pt-1 text-base">
                            <SwitchPermissions
                              selectedPermissions={item.permissions}
                              onChange={() => {}}
                            />
                          </div>
                        </Cell>
                        <Cell />
                        <Cell />
                        <Cell />
                      </Row>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ResizableTableContainer>
        </TabPanel>

        <TabPanel id="received">
          {/* Use ResizableTableContainer as I am unable to adjust the width of the Table component for some reason */}
          <ResizableTableContainer>
            <Table aria-label="Invitations" selectionMode="multiple">
              <TableHeader>
                <Column isRowHeader>Inviter</Column>
                <Column>Invited On</Column>
                <Column width={90}>Status</Column>
                <Column width={192}>Actions</Column>
              </TableHeader>
              <TableBody renderEmptyState={() => 'No results found.'}>
                {state.invitationsByInvitee.map((item) => (
                  <React.Fragment key={item.id}>
                    <Row>
                      <Cell>{item.inviterEmail}</Cell>
                      <Cell>{item.createdAt}</Cell>
                      <Cell>{item.status}</Cell>
                      <Cell>
                        <div className="flex justify-end">
                          {item.status === Status.Pending && (
                            <>
                              <span className="mr-1">
                                <Button>Accept</Button>
                              </span>

                              <ButtonTransparent>Reject</ButtonTransparent>
                            </>
                          )}

                          <ButtonTransparent
                            borderless
                            onPress={() => handleToggleRow(item.id)}
                          >
                            {expandedRows.has(item.id) ? '▲' : '▼'}
                          </ButtonTransparent>
                        </div>
                      </Cell>
                    </Row>
                    {expandedRows.has(item.id) && (
                      <Row className="relative h-[200px]">
                        <Cell className="absolute">
                          <div className="p-4 pt-1 text-base">
                            <SwitchPermissions
                              selectedPermissions={item.permissions}
                              onChange={() => {}}
                            />
                          </div>
                        </Cell>
                        <Cell />
                        <Cell />
                        <Cell />
                      </Row>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ResizableTableContainer>
        </TabPanel>
      </Tabs>
    </>
  )
}
