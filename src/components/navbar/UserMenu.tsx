'use client';

import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Link } from "@heroui/react"
import { Session } from 'next-auth';
import React from 'react'
import { signOut } from "next-auth/react"

type Props = {
    session: Session
}

export default function UserMenu({ session }: Props) {
    return (
        <Dropdown placement="bottom-start">
            <DropdownTrigger>
                {/* <Avatar
                    as="button"
                    isBordered
                    className="transition-transform"
                    name={user?.name || "User"}
                /> */}
                <div className='text-lg rounded-lg bg-slate-200 px-2 py-0.5'>{session.user?.name}</div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-bold">{session.user?.name}</p>
                    <p className="font-bold">{session.user?.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">
                    My Settings
                </DropdownItem>
                <DropdownItem key="logout"
                    className="text-danger"
                    color="danger"
                    onPress={() => { signOut({ redirectTo: "/" }) }}
                >
                    Sign Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
