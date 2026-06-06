import { useState } from 'react'
import { useLogin, useRegister } from '../hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: register, isPending: isRegisterPending } = useRegister()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogin = e => {
    if (!username || !password) return
    e.preventDefault()

    login(
      { username, password },
      {
        onSuccess: data => {
          localStorage.setItem('token', data.token)
          queryClient.clear()
          queryClient.setQueryData(['user'], data.user)
          navigate('/')
        },
        onError: error => {
          alert(error)
        },
      }
    )
  }

  const handleRegister = e => {
    if (!username || !password) return
    e.preventDefault()

    register(
      { username, password },
      {
        onSuccess: data => {
          localStorage.setItem('token', data.token)
          queryClient.clear()
          queryClient.setQueryData(['user'], data.user)
          navigate('/')
        },
        onError: error => {
          alert(error)
        },
      }
    )
  }

  const handleBlur = () => {
    setErrors({
      username: !username ? 'Username is required' : null,
      password: !password ? 'Password is required' : null,
    })
  }

  return (
    <div className="Login h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-800!">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login or Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onBlur={handleBlur}
                />
                <FieldError>{errors.username}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={handleBlur}
                />
                <FieldError>{errors.password}</FieldError>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleLogin} disabled={isLoginPending}>
            {isLoginPending && <Spinner data-icon="inline-start" />}Login
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={isRegisterPending}
            onClick={handleRegister}>
            {isRegisterPending && <Spinner data-icon="inline-start" />}Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
