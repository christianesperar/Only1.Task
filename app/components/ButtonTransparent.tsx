import { ReactNode } from 'react'
import { Button, ButtonProps } from 'react-aria-components'

interface ButtonTransparentProps extends ButtonProps {
  children: ReactNode
  borderless?: boolean
}

export default function ButtonTransparent({
  children,
  borderless,
  ...props
}: ButtonTransparentProps) {
  return (
    <span
      className={`
        [&_.react-aria-Button]:bg-transparent
        ${borderless ? '' : '[&_.react-aria-Button]:border [&_.react-aria-Button]:border-solid [&_.react-aria-Button]:border-white'}
      `}
    >
      <Button {...props}>{children}</Button>
    </span>
  )
}
