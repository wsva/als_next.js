'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem } from "@heroui/react"
import { useRouter } from "next/navigation";
import React from 'react'

export default function ListeningMenu() {
    const router = useRouter();
    
    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>Listening</DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
                <DropdownItem
                    href='/listening/dictation'
                    key="listening_dictation"
                    description="dictation"
                    onPress={() => router.push("/listening/dictation")}
                >
                    dictation
                </DropdownItem>
                <DropdownItem
                    href='/listening/subtitle/prepare'
                    key="listening_prepare"
                    description="clean up the styles and merge separated lines"
                    onPress={() => router.push("/listening/subtitle/prepare")}
                >
                    prepare subtitle
                </DropdownItem>
                <DropdownItem
                    href='/listening/subtitle/merge'
                    key="listening_merge"
                    description="merge original and translated subtitles"
                    onPress={() => router.push("/listening/subtitle/merge")}
                >
                    merge subtitles
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
