'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem } from "@heroui/react"
import { useRouter } from "next/navigation";
import React from 'react'

export default function WordMenu() {
    const router = useRouter();

    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>Word</DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
                <DropdownItem
                    href='/word/store'
                    key="word_store"
                    description="select words in store"
                    onPress={() => router.push("/word/store")}
                >
                    Word Store
                </DropdownItem>
                <DropdownItem
                    href='/word/original'
                    key="word_original"
                    description="view original texts"
                    onPress={() => router.push("/word/original")}
                >
                    Original
                </DropdownItem>
                <DropdownItem
                    href='/word/text'
                    key="word_text"
                    description="view preprocessed texts"
                    onPress={() => router.push("/word/text")}
                >
                    Text
                </DropdownItem>
                <DropdownItem
                    href='/word/sentence'
                    key="word_sentence"
                    description="search sentences"
                    onPress={() => router.push("/word/sentence")}
                >
                    Sentence
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
