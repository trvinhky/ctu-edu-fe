import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled(Button)`
  text-transform: capitalize;
`

const ButtonLinkCustom = (
  {
    children,
    href,
    shape
  }: {
    children: React.ReactNode,
    href: string,
    shape?: "circle" | "default" | "round"
  }
) => {
  return (
    <Wrapper
      type="primary"
      shape={`${shape ?? 'round'}`}
    >
      <Link to={href}>
        {children}
      </Link>
    </Wrapper>
  )
}

export default ButtonLinkCustom