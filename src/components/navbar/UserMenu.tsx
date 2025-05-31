'use client';

import { signOutUser } from '@/app/actions/authActions';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Link } from "@heroui/react"
import { Session } from 'next-auth';
import React from 'react'

type Props = {
    user: Session['user']
}

export default function UserMenu({ user }: Props) {
    return (
        <Dropdown placement="bottom-start">
            <DropdownTrigger>
                {/* <Avatar
                    as="button"
                    isBordered
                    className="transition-transform"
                    name={user?.name || "User"}
                /> */}
                <div className='text-lg rounded-lg bg-slate-200 px-2 py-0.5'>{user?.name}</div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">{user?.name}</p>
                    <p className="font-bold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">
                    My Settings
                </DropdownItem>
                <DropdownItem key="logout"
                    className="text-danger"
                    color="danger"
                    onPress={async () => { await signOutUser() }}
                >
                    Sign Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
