import { ReactNode } from 'react'
import { Switch, Label } from 'react-aria-components'
import { Permission } from '@app/types/invitation'

interface PermissionSelectorProps {
  children?: ReactNode
  selectedPermissions: Permission[]
  isInvalid?: boolean
  onChange: (permissions: Permission[]) => void
}

export default function PermissionSelector({
  children,
  selectedPermissions,
  isInvalid = false,
  onChange,
}: PermissionSelectorProps) {
  const handlePermissionChange = (
    permission: Permission,
    isSelected: boolean,
  ) => {
    let updatedPermissions = new Set(selectedPermissions)

    if (isSelected) {
      updatedPermissions.add(permission)

      if (permission === Permission.WritePosts) {
        updatedPermissions.add(Permission.ReadPosts)
      }

      if (permission === Permission.WriteMessages) {
        updatedPermissions.add(Permission.ReadMessages)
      }

      if (permission === Permission.WriteProfileInfo) {
        updatedPermissions.add(Permission.ReadProfileInfo)
      }
    } else {
      updatedPermissions.delete(permission)
    }

    onChange([...updatedPermissions])
  }

  return (
    <>
      <Label>Permissions</Label>
      {Object.values(Permission).map((permission) => (
        <div className="mb-1" key={permission}>
          <Switch
            isSelected={selectedPermissions.includes(permission)}
            onChange={(isSelected) =>
              handlePermissionChange(permission, isSelected)
            }
          >
            <div className="indicator" />
            <span className="text-base">{permission}</span>
          </Switch>
        </div>
      ))}

      {/*
        Switch seems doesn't have invalid state.
      */}
      {isInvalid && <p className="text-red-500 -mt-3">{children}</p>}
    </>
  )
}
