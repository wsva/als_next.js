'use client'

import { searchSentenceByKeyword, searchSentenceByLemma } from '@/app/actions/wordActions'
import React, { useEffect, useState } from 'react'
import { ActionResult, sentence } from '@/lib/types';
import { CircularProgress, Input } from "@heroui/react";
import { BiSearch } from 'react-icons/bi';
import SentenceList from '@/components/SentenceList';

const SearchBar = ({ label, value, setValue, doSearch }: {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    doSearch: () => {},
}
) => {
    return (
        <Input
            isClearable
            radius="sm"
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
            label={label}
            placeholder=''
            startContent={
                <BiSearch className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
            onKeyDown={(e) => {
                if (e.key == 'Enter' && value.length > 0) {
                    doSearch()
                }
            }}
        />
    )
}

type Props = {
    keyword: string;
    lemma: string;
};

export default function Search({ keyword, lemma }: Props) {
    const [stateLoading, setStateLoading] = useState<boolean>(false)
    const [stateKeyword, setStateKeyword] = useState<string>(keyword);
    const [stateLemma, setStateLemma] = useState<string>(lemma);
    const [stateResult, setStateResult] = useState<ActionResult<sentence[]>>()

    useEffect(() => {
        const loadData = async () => {
            setStateLoading(true)
            if (stateLemma.length > 0) {
                doSearchByLemma()
            } else {
                if (stateKeyword.length > 0) {
                    doSearchByKeyword()
                }
            }
            setStateLoading(false)
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 空依赖数组意味着仅在组件挂载时执行一次

    const doSearchByKeyword = async () => {
        const keywords = stateKeyword.split(/\s+/).filter(
            (v) => v.match(/^[a-zA-Z0-9äÄöÖüÜßé]+$/))
        setStateResult(await searchSentenceByKeyword(keywords))
    }

    const doSearchByLemma = async () => {
        const lemmas = stateLemma.split(/\s+/).filter(
            (v) => v.match(/^[a-zA-Z0-9äÄöÖüÜßé]+$/))
        setStateResult(await searchSentenceByLemma(lemmas))
    }

    return (
        <div className='flex flex-col gap-4 my-10'>
            <SearchBar label='Search by keyword' value={stateKeyword}
                setValue={setStateKeyword} doSearch={doSearchByKeyword}
            />

            <SearchBar label='Search by lemma' value={stateLemma}
                setValue={setStateLemma} doSearch={doSearchByLemma}
            />

            {stateLoading
                ? (
                    <div className='flex flex-row w-full items-center justify-center gap-4'>
                        <CircularProgress label="Loading..." />
                    </div >
                )
                : (
                    stateResult && (stateResult.status === 'success') && (
                        <SentenceList list={stateResult.data} />
                    )
                )
            }
        </div>
    )
}
