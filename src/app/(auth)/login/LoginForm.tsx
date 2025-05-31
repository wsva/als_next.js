'use client'

import React from 'react'
import { signInUser } from '@/app/actions/authActions'
import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from "@heroui/react"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (formData: LoginSchema) => {
    const result = await signInUser(formData)
    if (result.status === 'success') {
      router.push('/')
      // 不加 refresh 的话，登陆成功后， Navbar 上的用户信息组件不会自动刷出来
      router.refresh()
    } else {
      toast.error(result.error as string)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='space-y-4'>
        <Input
          label='Email'
          variant='bordered'
          {...register("email")}
          isInvalid={!!formState.errors.email}
          errorMessage={formState.errors.email?.message}
        />
        <Input
          label='Password'
          variant='bordered'
          type='password'
          {...register("password")}
          isInvalid={!!formState.errors.password}
          errorMessage={formState.errors.password?.message}
        />
        <Button
          isLoading={formState.isSubmitting}
          fullWidth
          color="secondary"
          type='submit'
          isDisabled={!formState.isValid}
        >
          Login
        </Button>
      </div>
    </form>
  )
}
