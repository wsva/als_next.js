'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem } from "@heroui/react"
import { useRouter } from "next/navigation";
import React from 'react'

export default function CardMenu() {
    const router = useRouter();
    
    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>Card</DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
                <DropdownItem
                    href='/card/tag'
                    key="card_tag"
                    description="manage tags"
                    onPress={() => router.push("/card/tag")}
                >
                    Manage Tags
                </DropdownItem>
                {/*---------------------------------------*/}
                <DropdownItem
                    href='/card/add?edit=y'
                    key="card_add"
                    description="add new card"
                    onPress={() => router.push("/card/add?edit=y")}
                >
                    Add Card
                </DropdownItem>
                <DropdownItem
                    href='/card/my'
                    key="card_my"
                    description="my cards"
                    onPress={() => router.push("/card/my")}
                >
                    My Cards
                </DropdownItem>
                <DropdownItem
                    href='/card/market'
                    key="card_market"
                    description="cards by others"
                    onPress={() => router.push("/card/market")}
                >
                    Card Market
                </DropdownItem>
                <DropdownItem
                    href='/card/test'
                    key="test"
                    description="learn cards"
                    onPress={() => router.push("/card/test")}
                >
                    Card Test
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
