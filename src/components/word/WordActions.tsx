'use client'

import { trashWord } from '@/app/actions/wordActions';
import { saveCard, removeCard, saveCardTag, getTagAll, getTag, createTag } from '@/app/actions/cardActions';
import { getUUID, getWordUserUUID } from '@/lib/utils';
import { Button, ButtonGroup, card, Link, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from "@heroui/react"
import { qsa_card, qsa_tag } from '@prisma/client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CardModal from './CardModal';
import AddCorrectionMap from './AddCorrectionMap';
import { card_ext, word } from '@/lib/types';
import { BiAddToQueue, BiEdit, BiLinkExternal, BiPlus, BiSolidBolt, BiTransfer, BiTrash } from 'react-icons/bi';

type Props = {
    word: word;
    email: string;
}

export default function WordActions({ word, email }: Props) {
    const [stateDisabled, setStateDisabled] = useState<boolean>(
        word.card_uuid && word.card_uuid.length > 0 ? true : false
    )
    const [stateTagList, setStateTagList] = useState<qsa_tag[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    /* 
        const addWordSimple = async () => {
            const result = await saveWordUser({
                uuid: getWordUserUUID(email, word.language!, word.word!),
                user_id: email,
                word: word.word!,
                language: word.language!,
                familiarity: 0,
                domain_list: word.domain_list!,
                in_dict: word.in_dict!,
                alias: '',
                note: '',
                created_at: new Date(),
                updated_at: new Date(),
            })
            if (result.status === 'success') {
                setStateDisabled(true)
                toast.success(`added ${word.word}`)
            } else {
                toast.error(`add ${word.word} failed`)
            }
        }
    
        const addWordAdvance = async (formData: word_user) => {
            console.log(formData)
            const result = await saveWordUser({
                ...formData,
                uuid: getWordUserUUID(email, formData.language, formData.word),
                user_id: email,
                familiarity: parseInt(`${formData.familiarity}`),
                created_at: new Date(),
                updated_at: new Date(),
            })
            if (result.status === 'success') {
                setStateDisabled(true)
                toast.success(`saved ${formData.word}`)
            } else {
                toast.error(`save ${formData.word} failed`)
            }
        }
     */

    const addCardEasy = async () => {
        const card_uuid = getUUID()
        const result = await saveCard({
            uuid: card_uuid, //getWordUserUUID(email, word.language!, word.word!),
            user_id: email,
            question: word.word!,
            suggestion: '',
            answer: 'easy',
            familiarity: 6,
            note: `{"type":"word", "language":${JSON.stringify(word.language)}, "lemma":${JSON.stringify(word.word)}, "in_dict":${word.in_dict ? "true" : "false"}, "domain_list":${JSON.stringify(word.domain_list)}}`,
            created_at: new Date(),
            updated_at: new Date(),
        })
        if (result.status === 'success') {
            setStateDisabled(true)
            toast.success(`added ${word.word}`)
        } else {
            toast.error(`add ${word.word} failed`)
        }

        const tag_uuid = `word_${word.language}_by_system`
        await createTag({
            uuid: tag_uuid,
            tag: `word_${word.language}`,
            description: "created by system",
            user_id: "public",
            created_at: new Date(),
            updated_at: new Date(),
        })

        const result_tag = await saveCardTag({
            uuid: card_uuid,
            tag_list_new: [tag_uuid],
        })
        if (result_tag.status === 'success') {
            toast.success(`add tag successfully`)
        } else {
            toast.error(`add tag failed`)
        }
    }

    const addCardAdvance = async (formData: card_ext) => {
        //const card_uuid = getWordUserUUID(email, word.language!, word.word!)
        const card_uuid = getUUID()
        const result = await saveCard({
            uuid: card_uuid,
            user_id: email,
            question: formData.question || "",
            suggestion: formData.suggestion || "",
            answer: formData.answer || "",
            familiarity: formData.familiarity || 0,
            note: formData.note || "",
            created_at: new Date(),
            updated_at: new Date(),
        })
        if (result.status === 'success') {
            setStateDisabled(true)
            toast.success(`saved ${formData.question}`)
        } else {
            toast.error(`save ${formData.question} failed`)
        }

        const tag_uuid = `word_${word.language}_by_system`
        await createTag({
            uuid: tag_uuid,
            tag: `word_${word.language}`,
            description: "created by system",
            user_id: "public",
            created_at: new Date(),
            updated_at: new Date(),
        })

        if (!formData.tag_list_new) {
            formData.tag_list_new = []
        }
        if (!formData.tag_list_new.includes(tag_uuid)) {
            formData.tag_list_new.push(tag_uuid)
        }
        const result_tag = await saveCardTag({
            uuid: card_uuid,
            tag_list_new: formData.tag_list_new,
        })
        if (result_tag.status === 'success') {
            toast.success(`save tag successfully`)
        } else {
            toast.error(`save tag failed`)
        }
    }

    const moveToTrash = async () => {
        const result = await trashWord(word.word!, email)
        if (result.status === 'success') {
            setStateDisabled(true)
            toast.success(`moved ${word.word} to trash`)
        } else {
            toast.error(`move ${word.word} to trash failed`)
        }
    }

    return (
        <>
            <ButtonGroup variant='light'>
                <Tooltip color='primary' content="easy & never appear again">
                    <Button isIconOnly variant='light' isDisabled={stateDisabled} onPress={addCardEasy} >
                        <BiSolidBolt size={20} />
                    </Button>
                </Tooltip>
                <Tooltip color='primary' closeDelay={0} content='add card'>
                    <Button isIconOnly variant='light' isDisabled={stateDisabled}
                        onPress={async () => {
                            const result = await getTagAll(email || "")
                            if (result.status === "success") {
                                setStateTagList(result.data)
                            }
                            onOpen()
                        }}
                    >
                        <BiPlus size={20} />
                    </Button>
                </Tooltip>
                {/* 
                <Tooltip color='primary' content="add card">
                    <Button isIconOnly variant='light' onClick={addCardSimple} >
                        <BiPlus size={20} />
                    </Button>
                </Tooltip>
                <Tooltip color='primary' closeDelay={0} content='add card +'>
                    <Button isIconOnly onPress={onOpen} variant='light' >
                        <BiAddToQueue size={20} />
                    </Button>
                </Tooltip>
                 */}
                <Tooltip color="primary" content="view examples">
                    <Button isIconOnly variant='light' as={Link} target='_blank'
                        href={`/word/sentence?lemma=${word.word}`}
                    >
                        <BiLinkExternal size={20} />
                    </Button>
                </Tooltip>
                <Popover placement='bottom' classNames={{ content: 'bg-slate-200' }} >
                    <Tooltip color="primary" content="set correction map">
                        {/**
                         * https://github.com/nextui-org/nextui/issues/1265
                         * Tooltip and Popover cannot share the same DOM element as trigger element.
                         * A workaround is to add an extra element inside the Tooltip. Keep in mind that the focus state will be handled differently.
                         */}
                        <div className="max-w-fit">
                            <PopoverTrigger>
                                <Button isIconOnly variant='light' isDisabled={stateDisabled}>
                                    <BiTransfer size={20} />
                                </Button>
                            </PopoverTrigger>
                        </div>
                    </Tooltip>
                    <PopoverContent>
                        <div className=''>
                            <AddCorrectionMap lemma={word.word} />
                        </div>
                    </PopoverContent>
                </Popover>
                <Tooltip color="danger" content="move to trash">
                    <Button isIconOnly variant='light' isDisabled={stateDisabled}
                        onPress={moveToTrash}
                    >
                        <BiTrash size={20} />
                    </Button>
                </Tooltip>
            </ButtonGroup >
            <CardModal
                word={word}
                tag_list={stateTagList}
                isOpen={isOpen}
                isDisabled={stateDisabled}
                onOpenChange={onOpenChange}
                onSubmit={addCardAdvance}
            />
        </>
    )
}
