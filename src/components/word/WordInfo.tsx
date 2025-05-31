'use client'

import React from 'react';
import { word } from '@/lib/types';
import { Chip, Tooltip } from "@heroui/react";

type Props = {
    word: word;
    email?: string;
}

const getInfoItem = (tip: string, value: string) => {
    return (
        <Tooltip content={tip}>
            <Chip size='lg' variant='flat'>{value}</Chip>
        </Tooltip>
    )
}

export default function WordInfo({ word, email }: Props) {
    return (
        <div className='flex flex-row items-center justify-start gap-1'>
            {word.level && getInfoItem('level', word.level)}
            {word.count && getInfoItem('count', `${word.count}`)}
            {word.language && getInfoItem('language', word.language)}
            {word.domain_list && getInfoItem('domains', word.domain_list)}
        </div>
    );
}
