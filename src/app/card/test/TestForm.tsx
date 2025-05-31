'use client'

import { setCardFamiliarity } from '@/app/actions/cardActions';
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Tooltip,
    Textarea,
    DropdownSection,
} from "@heroui/react";
import React, { useState } from 'react'
import { qsa_card } from '@prisma/client'
import { getHTML } from '@/lib/utils';
import Link from 'next/link';
import { BiCaretDown } from 'react-icons/bi';
import { ActionResult, sentence } from '@/lib/types';
import SentenceList from '@/components/SentenceList';
import { searchSentenceByLemma } from '@/app/actions/wordActions';
import { FamiliarityList } from '@/lib/card';
import '@/lib/Markdown.css';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

type Props = {
    user_id: string;
    item: qsa_card;
    tag_uuid: string;
}

export default function TestForm({ user_id, item, tag_uuid }: Props) {
    const [stateSuggestion, setStateSuggestion] = useState<boolean>(false)
    const [stateAnswer, setStateAnswer] = useState<boolean>(false)
    const [stateExamples, setStateExamples] = useState<ActionResult<sentence[]>>()
    const router = useRouter()

    const getColor = (familiarity: number) => {
        return FamiliarityList.map((v) => v.color)[familiarity]
    }

    return (
        (<div className="flex flex-col my-5 mx-5">
            <div className="flex flex-row gap-4 items-end justify-end">
                <Button as={Link} target='_blank' color='secondary' href={`/card/${item.uuid}/?edit=y`}>
                    EDIT
                </Button>
                <Button color='secondary' onPress={() => window.location.reload()}>
                    NEXT
                </Button>
            </div>
            <div className="flex flex-row items-center justify-center">
                {item.question.length < 30
                    ? (<div className='my-5 font-bold text-2xl md:text-4xl lg:text-6xl xl:text-8xl'>
                        <pre className='font-roboto leading-none'>
                            {item.question}
                        </pre>
                    </div>)
                    : (<div className='my-5 font-bold text-base md:text-xl lg:text-2xl xl:text-4xl'>
                        <pre className='font-roboto leading-none'>
                            {item.question}
                        </pre>
                    </div>)
                }
            </div>
            <div className='flex flex-row my-5 items-center justify-center gap-4'>
                {item.suggestion.length > 0 ? (
                    <Button
                        color="primary"
                        variant="solid"
                        onPress={() => setStateSuggestion(!stateSuggestion)}
                    >
                        {stateSuggestion ? 'hide suggestion' : 'show suggestion'}
                    </Button>
                ) : null}
                <Button
                    color="primary"
                    variant="solid"
                    onPress={() => setStateAnswer(!stateAnswer)}
                >
                    {stateAnswer ? 'hide answer' : 'show answer'}
                </Button>
                <ButtonGroup variant='solid' color='primary'>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button>
                                feedback <BiCaretDown />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            className="max-w-[300px]"
                            selectionMode="single"
                            onSelectionChange={async (keys) => {
                                if (keys.currentKey) {
                                    const familiarity = parseInt(keys.currentKey)
                                    const result = await setCardFamiliarity(user_id, item.uuid, familiarity)
                                    if (result.status === "success") {
                                        window.location.reload()
                                    } else {
                                        toast.error("save familiarity error")
                                    }
                                }
                            }}
                        >
                            {/*
                            Type 'Element[]' is not assignable to type 'CollectionElement<object>'
                            https://github.com/nextui-org/nextui/issues/1691
                             */}
                            <DropdownSection items={FamiliarityList}>
                                {FamiliarityList.map((v) => {
                                    return (
                                        <DropdownItem key={v.value} description={v.description} className={`${getColor(v.value)}`}>
                                            {`${v.value} - ${v.label}`}
                                        </DropdownItem>
                                    )
                                })}
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </ButtonGroup>
            </div>
            {stateSuggestion ? (
                <Textarea isDisabled
                    classNames={{ input: 'text-2xl leading-tight font-roboto' }}
                    defaultValue={item.suggestion}
                />
            ) : null}
            {stateAnswer ? (
                <div
                    className='MD my-1 text-base md:text-xl lg:text-2xl xl:text-4xl leading-tight font-roboto indent-0 whitespace-pre-wrap break-words hyphens-auto'
                    dangerouslySetInnerHTML={{
                        __html: getHTML(item.answer)
                    }}
                />
            ) : null}
            {stateAnswer ? (
                <Textarea isDisabled
                    classNames={{ input: 'text-2xl leading-tight font-roboto' }}
                    defaultValue={item.note}
                />
            ) : null}
            {item.note.indexOf(`"lemma":"`) >= 0 && (
                <div className="flex flex-row gap-4 items-center justify-center">
                    <Button color='primary'
                        onPress={async () => {
                            let m = item.note.match(/"lemma":"([^"]+)"/)
                            if (m) {
                                let lemmas = [m[1].trim()]
                                setStateExamples(await searchSentenceByLemma(lemmas))
                            }
                        }}
                    >
                        View Examples
                    </Button>
                </div>
            )}
            {stateExamples && (stateExamples.status === 'success') && (
                <SentenceList list={stateExamples.data} />
            )}
        </div>)
    );
}
