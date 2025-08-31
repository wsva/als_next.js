'use client';

import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react"
import Link from 'next/link'
import React from 'react'
import UserMenu from './UserMenu'
import WordMenu from './WordMenu'
import ListeningMenu from './ListeningMenu'
import BlogMenu from './BlogMenu'
import CardMenu from './CardMenu'
import { signIn } from "next-auth/react"
import { Session } from "next-auth"

type Props = {
    session: Session | null
}

export default function TopNav({ session }: Props) {
    return (
        <Navbar
            shouldHideOnScroll
            maxWidth='full'
            //className='border-b-1'
            className='bg-gradient-to-b from-[#ECD2B0] to-[#FBEDDA]'
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
                    <UserMenu session={session} />
                ) : (
                    <Button variant='bordered' className='text-gray-500'
                        onPress={() => signIn('wsva_oauth2')}
                    >
                        Login
                    </Button>
                )}
            </NavbarContent>
        </Navbar>
    )
}
