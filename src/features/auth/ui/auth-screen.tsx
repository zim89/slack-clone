'use client'

import { useState } from 'react'
import { AuthFlowEnum, AuthFlowType } from '@/entities/auth'
import { SignInCard } from './sign-in-card'
import { SignUpCard } from './sign-up-card'

export const AuthScreen = () => {
  const [state, setState] = useState<AuthFlowType>(AuthFlowEnum.SignIn)

  return (
    <div className='bg-brand flex h-full items-center justify-center'>
      <div className='md:h-auto md:w-[420px]'>
        {state === AuthFlowEnum.SignIn ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  )
}
