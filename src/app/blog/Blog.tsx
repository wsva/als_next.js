'use client'

import { formatDate } from '@/lib/utils';
import { Listbox, ListboxItem } from "@heroui/react"
import { blog } from '@prisma/client';
import Link from 'next/link';
import React from 'react'

type Props = {
    list: blog[];
}

export default function Blog({ list }: Props) {
    return (
        <Listbox
            items={list}
            aria-label="blog list"
            className='my-5'
        >
            {(item) => (
                <ListboxItem
                    key={item.uuid}
                    className="flex flex-col w-full mb-1 items-start bg-slate-200"
                >
                    <Link target='_blank'
                        href={`/blog/${item.uuid}`}
                        className='text-2xl text-blue-600 hover:underline'
                    >
                        {item.title}
                    </Link>
                    <div className='text-sm text-slate-500' >
                        {item.description}
                    </div>
                    <div className='text-sm text-slate-400' >
                        {formatDate(item.created_at)}
                    </div>
                </ListboxItem>
            )}
        </Listbox>
    )
}
