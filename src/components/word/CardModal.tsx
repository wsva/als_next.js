'use client'

import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link, Tooltip, Textarea, Select, SelectItem, SelectSection, CheckboxGroup } from "@heroui/react";
import { useForm } from 'react-hook-form';
import { card_ext, word } from '@/lib/types';
import { FamiliarityList } from '@/lib/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { qsa_tag } from '@prisma/client';
import { getTagAll } from '@/app/actions/cardActions';


type Props = {
    word: word;
    tag_list: qsa_tag[];
    isOpen: boolean;
    isDisabled: boolean;
    onOpenChange: () => void;
    onSubmit: (formData: card_ext) => Promise<void>
}

export default function WordModal({ word, tag_list, isOpen, isDisabled, onOpenChange, onSubmit }: Props) {
    const [stateSelectedTags, setStateSelectedTags] = useState<string[]>(
        [`word_${word.language}_by_system`]
    );

    const { register, handleSubmit, formState } = useForm<card_ext>({
        resolver: zodResolver(z.object({
            question: z.string().min(1, { message: "question cannot be empty" }),
            suggestion: z.string(),
            answer: z.string().min(1, { message: "answer cannot be empty" }),
            // react-hook-form treat all input values as strings by default
            familiarity: z.string(),
            note: z.string(),
        })),
        mode: 'onTouched',
    });

    const getColor = (familiarity: number) => {
        return FamiliarityList.map((v) => v.color)[familiarity]
    }
    const getDescription = (familiarity: number) => {
        return FamiliarityList.map((v) => v.description)[familiarity]
    }

    const onSubmitWithPreprocess = async (formData: card_ext) => {
        if (typeof formData.familiarity === "string") {
            formData.familiarity = parseInt(formData.familiarity || '0', 10)
        }
        formData.tag_list_new = stateSelectedTags
        onSubmit(formData)
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement='top-center'
            size='xl'
        >
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={handleSubmit(onSubmitWithPreprocess)}>
                        <ModalHeader className='flex flex-col gap-1'>Edit Card</ModalHeader>
                        <ModalBody>
                            <Input label='question' variant='bordered'
                                defaultValue={word.word}
                                {...register('question')}
                                isInvalid={!!formState.errors.question}
                                errorMessage={formState.errors.question?.message}
                            />
                            <Select aria-label='select familiarity'
                                selectionMode='single'
                                defaultSelectedKeys={["0"]}
                                {...register('familiarity')}
                            >
                                <SelectSection items={FamiliarityList}>
                                    {FamiliarityList.map((v) =>
                                        <SelectItem key={v.value} className={`${getColor(v.value)}`}>{`${v.value} - ${v.label}`}</SelectItem>
                                    )}
                                </SelectSection>
                            </Select>
                            {tag_list.length > 0
                                ? (<CheckboxGroup
                                    color="success"
                                    value={stateSelectedTags}
                                    onValueChange={setStateSelectedTags}
                                    orientation="horizontal"
                                >
                                    {tag_list.map((v) => {
                                        return <Checkbox key={v.uuid} value={v.uuid}>{v.tag}</Checkbox>
                                    })}
                                </CheckboxGroup>)
                                : (<div>not tag found</div>)
                            }
                            <Input label='suggestion' variant='bordered'
                                {...register('suggestion')}
                            />
                            <Textarea label='answer' variant='bordered'
                                {...register('answer')}
                                isInvalid={!!formState.errors.answer}
                                errorMessage={formState.errors.answer?.message}
                            />
                            <Textarea label='Note' variant='bordered'
                                defaultValue={`{"type":"word", "language":${JSON.stringify(word.language)}, "lemma":${JSON.stringify(word.word)}, "in_dict":${word.in_dict ? "true" : "false"}, "domain_list":${JSON.stringify(word.domain_list)}}`}
                                {...register('note')}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color='danger' variant='flat' onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color='primary' type='submit' isDisabled={isDisabled} >
                                Submit
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}
