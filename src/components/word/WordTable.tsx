'use client'

import { Chip, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react"
import React, { useEffect, useState } from 'react'
import WordActions from './WordActions'
import { word } from '@/lib/types'
import WordInfo from './WordInfo'
import { getTagAll } from '@/app/actions/cardActions'
import { qsa_tag } from '@prisma/client'

type Props = {
    words?: word[];
    email?: string;
}

export default function WordTable({ words, email }: Props) {
    return (
        <Table isStriped aria-label='word'>
            <TableHeader>
                <TableColumn className='border-1'>Word</TableColumn>
                <TableColumn className='border-1'>Actions</TableColumn>
                <TableColumn className='border-1'>Info</TableColumn>
            </TableHeader>
            <TableBody items={words}>
                {(item) => {
                    return (
                        <TableRow key={item.uuid} className='border-1'>
                            <TableCell className='border-1'>
                                {item.in_dict ? (
                                    <Tooltip content="in dictionary" placement='right' showArrow>
                                        <Chip color='success' size="lg" variant="flat">
                                            {item.word}
                                        </Chip>
                                    </Tooltip>) : (
                                    <Chip color='default' size="lg" variant="flat">
                                        {item.word}
                                    </Chip>
                                )}
                                {item.card_uuid && item.card_uuid.length > 0 && (
                                    <Tooltip placement='right' showArrow
                                        content={item.card_uuid.split(",").map((v, i) => {
                                            return <Link key={i} target='_blank'
                                                href={`/card/${v}`}
                                                className='text-blue-500'
                                            >
                                                {`Card ${i + 1}`}
                                            </Link>
                                        })}
                                    >
                                        <Chip color='warning' size="lg" variant="flat">
                                            in cards
                                        </Chip>
                                    </Tooltip>
                                )}
                            </TableCell>
                            <TableCell className='border-1'>
                                {email ? (
                                    <WordActions word={item} email={email} />
                                ) : (
                                    'not logged in'
                                )}
                            </TableCell>
                            <TableCell className='border-1'>
                                <WordInfo word={item} email={email} />
                            </TableCell>
                        </TableRow>
                    )
                }}
            </TableBody>
        </Table>
    )
}
