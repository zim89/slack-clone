import { useState, type FormEvent } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { TriangleAlert } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import {
  AuthFlowEnum,
  AuthProviderEnum,
  type AuthFlowType,
  type AuthProviderType,
} from '@/entities/auth'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Separator } from '@/shared/components/ui/separator'

interface SignInCardProps {
  setState: (state: AuthFlowType) => void
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const handleLoginWithCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setPending(true)
    signIn('password', { email, password, flow: AuthFlowEnum.SignIn })
      .catch(error => {
        console.log('[Login ERROR]: ', error)
        setError('Invalid email or password')
      })
      .finally(() => {
        setPending(false)
      })
  }

  const handleLoginWithProvider = (value: AuthProviderType) => {
    setPending(true)
    signIn(value).finally(() => {
      setPending(false)
    })
  }

  return (
    <Card className='h-full w-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className='bg-destructive/15 text-destructive mb-6 flex items-center gap-x-2 rounded-md p-3 text-sm'>
          <TriangleAlert className='size-4' />
          <p>{error}</p>
        </div>
      )}

      <CardContent className='space-y-5 px-0 pb-0'>
        <form onSubmit={handleLoginWithCredentials} className='space-y-2.5'>
          <Input
            disabled={pending}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Email'
            type='email'
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password'
            type='password'
            required
          />
          <Button type='submit' className='w-full' size='lg' disabled={pending}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className='flex flex-col gap-y-2.5'>
          <Button
            disabled={pending}
            onClick={() => handleLoginWithProvider(AuthProviderEnum.Google)}
            variant='outline'
            size='lg'
            className='relative w-full'
          >
            <FcGoogle className='absolute top-3 left-2.5 size-5' />
            Continue with Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => handleLoginWithProvider(AuthProviderEnum.Github)}
            variant='outline'
            size='lg'
            className='relative w-full'
          >
            <FaGithub className='absolute top-3 left-2.5 size-5' />
            Continue with Github
          </Button>
        </div>

        <p className='text-muted-foreground text-xs'>
          Don&apos;t have an account?{' '}
          <span
            onClick={() => setState(AuthFlowEnum.SignUp)}
            className='cursor-pointer text-sky-700 hover:underline'
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
