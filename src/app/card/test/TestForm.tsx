'use client'

import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Textarea, DropdownSection } from "@heroui/react";
import React, { useState } from 'react'
import { getHTML } from '@/lib/utils';
import Link from 'next/link';
import { BiCaretDown } from 'react-icons/bi';
import { ActionResult, card_review, sentence } from '@/lib/types';
import SentenceList from '@/components/SentenceList';
import { searchSentenceByLemma } from '@/app/actions/wordActions';
import { saveCardReview } from '@/app/actions/cardActions';
import { FamiliarityList } from '@/lib/card';
import '@/lib/Markdown.css';
import { toast } from 'react-toastify';

type Props = {
    user_id: string;
    item: card_review;
}

export default function TestForm({ user_id, item }: Props) {
    const [stateSuggestion, setStateSuggestion] = useState<boolean>(false)
    const [stateAnswer, setStateAnswer] = useState<boolean>(false)
    const [stateExamples, setStateExamples] = useState<ActionResult<sentence[]>>()

    const getColor = (familiarity: number) => {
        return FamiliarityList.map((v) => v.color)[familiarity]
    }

    const handleFeedback = async (familiarity: number) => {
        if (user_id !== item.user_id) {
            toast.error("this is not your card")
            return
        }

        let { repetitions, interval_days, ease_factor } = item;

        if (!interval_days) interval_days = 0
        if (!ease_factor) ease_factor = 0
        if (!repetitions) repetitions = 0

        if (familiarity < 3) {
            repetitions = 0;
            interval_days = 1;
        } else {
            if (repetitions === 0) {
                interval_days = 1;
            } else if (repetitions === 1) {
                interval_days = 6;
            } else {
                interval_days = Math.round(interval_days * ease_factor);
            }
            repetitions += 1;
        }

        ease_factor = ease_factor + (0.1 - (5 - familiarity) * (0.08 + (5 - familiarity) * 0.02));
        if (ease_factor < 1.3) {
            ease_factor = 1.3;
        }

        const next_review_at = new Date();
        next_review_at.setDate(next_review_at.getDate() + interval_days);

        const result = await saveCardReview({
            uuid: item.uuid,
            card_uuid: item.card_uuid,
            user_id: item.user_id,
            interval_days,
            ease_factor,
            repetitions,
            familiarity,
            last_review_at: new Date(),
            next_review_at,
        });
        if (result) {
            window.location.reload()
        } else {
            toast.error("save review error")
        }
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
                {item.card.question.length < 30
                    ? (<div className='my-5 font-bold text-2xl md:text-4xl lg:text-6xl xl:text-8xl'>
                        <pre className='font-roboto leading-none'>
                            {item.card.question}
                        </pre>
                    </div>)
                    : (<div className='my-5 font-bold text-base md:text-xl lg:text-2xl xl:text-4xl'>
                        <pre className='font-roboto leading-none'>
                            {item.card.question}
                        </pre>
                    </div>)
                }
            </div>
            <div className='flex flex-row my-5 items-center justify-center gap-4'>
                {item.card.suggestion.length > 0 ? (
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
                                    await handleFeedback(parseInt(keys.currentKey))
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
                    defaultValue={item.card.suggestion}
                />
            ) : null}
            {stateAnswer ? (
                <div
                    className='MD my-1 text-base md:text-xl lg:text-2xl xl:text-4xl leading-tight font-roboto indent-0 whitespace-pre-wrap break-words hyphens-auto'
                    dangerouslySetInnerHTML={{
                        __html: getHTML(item.card.answer)
                    }}
                />
            ) : null}
            {stateAnswer ? (
                <Textarea isDisabled
                    classNames={{ input: 'text-2xl leading-tight font-roboto' }}
                    defaultValue={item.card.note}
                />
            ) : null}
            {item.card.note.indexOf(`"lemma":"`) >= 0 && (
                <div className="flex flex-row gap-4 items-center justify-center">
                    <Button color='primary'
                        onPress={async () => {
                            let m = item.card.note.match(/"lemma":"([^"]+)"/)
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
