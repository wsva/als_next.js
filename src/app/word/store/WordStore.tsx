'use client'

import { getWordInStore, searchWordInStore } from '@/app/actions/wordActions'
import { CircularProgress, Input, Pagination } from "@heroui/react"
import React, { useEffect, useState } from 'react'
import { word } from '@/lib/types'
import WordTable from '@/components/word/WordTable'
import { BiSearch } from 'react-icons/bi'

type Props = {
    email?: string;
    language: "" | "en" | "de";
    keyword: string;
}

export default function WordStore({ email, language, keyword }: Props) {
    const [stateKeyword, setStateKeyword] = useState<string>(keyword)
    const [stateLoading, setStateLoading] = useState<boolean>(false)
    const [stateWords, setStateWords] = useState<word[]>([])
    const [stateCurrentPage, setStateCurrentPage] = useState<number>(1);
    const [stateTotalPages, setStateTotalPages] = useState<number>(0);

    const loadData = async (keyword: string, page: number) => {
        setStateLoading(true)
        if (!!keyword) {
            const result = await searchWordInStore(
                email || "", language, keyword, page, 20);
            console.log("result1", result)
            if (result.status === 'success') {
                setStateWords(result.data)
                setStateTotalPages(result.total_pages || 0)
            }
        } else {
            const result = await getWordInStore(
                email || "", language, page, 20)
            console.log("result2", result)
            if (result.status === 'success') {
                setStateWords(result.data)
                setStateTotalPages(result.total_pages || 0)
            }
        }
        setStateLoading(false)
    };

    useEffect(() => {
        loadData(stateKeyword, stateCurrentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex flex-col w-full items-start justify-start my-4 gap-4'>
            <Input
                isClearable
                radius="lg"
                classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                        "bg-transparent",
                        "text-black/90 dark:text-white/90",
                        "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                        "shadow-xl",
                        "bg-default-200/50",
                        "dark:bg-default/60",
                        "backdrop-blur-xl",
                        "backdrop-saturate-200",
                        "hover:bg-default-200/70",
                        "dark:hover:bg-default/70",
                        "group-data-[focus=true]:bg-default-200/50",
                        "dark:group-data-[focus=true]:bg-default/60",
                        "!cursor-text",
                    ],
                }}
                placeholder="Search in word store"
                startContent={
                    <BiSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
                value={stateKeyword}
                onClear={() => setStateKeyword("")}
                onChange={(e) => setStateKeyword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key == 'Enter') {
                        setStateWords([])
                        setStateCurrentPage(1)
                        loadData(stateKeyword, 1)
                    }
                }}
            />

            <div className='flex flex-row w-full items-center justify-center gap-4'>
                <div>Page</div>
                <Pagination showControls loop variant='bordered'
                    total={stateTotalPages} page={stateCurrentPage}
                    isDisabled={stateLoading}
                    onChange={(page) => {
                        setStateCurrentPage(page)
                        loadData(stateKeyword, page)
                    }}
                />
            </div >
            {stateLoading
                ? (
                    <div className='flex flex-row w-full items-center justify-center gap-4'>
                        <CircularProgress label="Loading..." />
                    </div >
                )
                : (<WordTable words={stateWords} email={email} />)
            }
            <div className='flex flex-row w-full items-center justify-center gap-4'>
                <div>Page</div>
                <Pagination showControls loop variant='bordered'
                    total={stateTotalPages} page={stateCurrentPage}
                    isDisabled={stateLoading}
                    onChange={(page) => {
                        setStateCurrentPage(page)
                        loadData(stateKeyword, page)
                    }}
                />
            </div>
        </div >
    )
}
