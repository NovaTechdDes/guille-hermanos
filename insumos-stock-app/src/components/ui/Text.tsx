import React from 'react'
import { Text as RNText, TextStyle } from 'react-native'

interface Props {
    children: React.ReactNode
    className?: string
    style?: TextStyle
}

export default function Text({ children, className = '' }: Props) {
  return (
    <RNText className={` ${className}` }>
        {children}
    </RNText>
  )
}