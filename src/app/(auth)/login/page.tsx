import React from 'react'
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import Link from 'next/link'
import { GiPadlock } from 'react-icons/gi'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className='flex items-center justify-center vertical-center'>
      <Card className='w-2/5 mx-autos'>
        <CardHeader className='flex flex-col items-center justify-center'>
          <div className='flex flex-col gap-2 items-center text-secondary-50'>
            <div className='flex flex-row items-center gap-3'>
              <GiPadlock size={30} />
              <h1 className='text-3xl font-semibold'>Login</h1>
            </div>
            <p className='text-neutral-500'>Alan&apos;s Learning System</p>
          </div>
        </CardHeader>
        <CardBody>
          <LoginForm />
        </CardBody>
        <CardFooter className='flex flex-row items-center justify-center'>
          <Link
            className='text-sm text-blue-600 hover:underline'
            href='/register'
          >
            Don&apos;t have an account?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
