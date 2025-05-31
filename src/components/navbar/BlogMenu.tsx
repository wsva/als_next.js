'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem } from "@heroui/react"
import { useRouter } from "next/navigation";
import React from 'react'

export default function BlogMenu() {
    const router = useRouter();
    
    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>Blog</DropdownTrigger>
            </NavbarItem>
            <DropdownMenu>
                <DropdownItem
                    href='/blog'
                    key="blog_index"
                    description="all blogs"
                    onPress={() => router.push("/blog")}
                >
                    Blog
                </DropdownItem>
                <DropdownItem
                    href='/blog/add'
                    key="blog_add"
                    description="add new blog"
                    onPress={() => router.push("/blog/add")}
                >
                    Add Blog
                </DropdownItem>
                <DropdownItem
                    href='/blog/all_of_others'
                    key="blog_all_of_others"
                    description="blogs by others"
                    onPress={() => router.push("/blog/all_of_others")}
                >
                    View Blogs By Others
                </DropdownItem>
                <DropdownItem
                    href='/blog/all_of_another'
                    key="blog_all_of_another"
                    description="blogs by another"
                    onPress={() => router.push("/blog/all_of_another")}
                >
                    View Blogs By Another
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
