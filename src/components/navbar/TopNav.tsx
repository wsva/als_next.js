import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react"
import Link from 'next/link'
import React from 'react'
import { auth } from '@/auth'
import UserMenu from './UserMenu'
import WordMenu from './WordMenu'
import ListeningMenu from './ListeningMenu'
import BlogMenu from './BlogMenu'
import CardMenu from './CardMenu'

export default async function TopNav() {
    const session = await auth()

    return (
        <Navbar
            shouldHideOnScroll
            maxWidth='full'
            //className='border-b-1'
            className='bg-gradient-to-b from-[#EBE1DA] to-[#FFF5EE]'
            classNames={{
                item: [
                    'text-sm',
                    'sm:text-xl',
                    'text-gray-500',
                    'uppercase',
                    'data-[active=true]:font-bold'
                ]
            }}
        >
            <NavbarBrand className='flex-grow-0 mr-1 sm:mr-4'>
                <Link
                    className='font-bold text-sm sm:text-2xl text-red-500'
                    href='/'
                >
                    ALS
                </Link>
            </NavbarBrand>

            <NavbarContent className="flex gap-1 sm:gap-4" justify="start">
                <WordMenu />
                <CardMenu />
                <ListeningMenu />
                <BlogMenu />
                {/* <NavLink href='/card/test' label='Test' /> */}
            </NavbarContent>

            <NavbarContent justify='end'>
                {session?.user ? (
                    <UserMenu user={session.user} />
                ) : (
                    <Button
                        as={Link}
                        href='/login'
                        variant='bordered'
                        className='text-gray-500'>
                        Login
                    </Button>
                )}
            </NavbarContent>
        </Navbar>
    )
}
