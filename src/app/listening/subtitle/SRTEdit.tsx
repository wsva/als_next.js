import { Avatar, Button, Input, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react"
import React, { useState } from 'react'
import { MdFavorite, MdHelp, MdPlayCircle } from 'react-icons/md'
import { SRT } from '../srt'
import Link from 'next/link'

type Props = {
    item: SRT.Item;
    index: number;
    refAudio: React.RefObject<HTMLAudioElement>;
}

export default function SRTEdit({ item, index, refAudio }: Props) {
    const [stateInput, setStateInput] = useState<string>('')
    const [stateSuccess, setStateSuccess] = useState<boolean>(false)
    const [stateTips, setStateTips] = useState<boolean>(false)

    const isSuccess = (answer: string) => {
        return answer === item.content()
            || SRT.pureContent(answer) === SRT.pureContent(item.content())
    }

    const getTip = (answer: string) => {
        const answerParts = SRT.splitContent(answer, true).map((v) => v.content)
        let tipParts = SRT.splitContent(item.content(), false)
        for (let i = 0; i < tipParts.length; i++) {
            if (tipParts[i].isWord
                && !answerParts.includes(tipParts[i].content)) {
                tipParts[i].content = SRT.hideWord(tipParts[i].content)
            }
        }
        return tipParts.map((v) => v.content).join('')
    }

    return (
        (<div className='flex flex-row items-center justify-start w-full gap-1' >
            <Tooltip content='turn green on success: punctuation does not matter'>
                <Avatar size='sm' radius="sm" name={`${item.position}`}
                    color={stateSuccess ? 'success' : 'default'}
                />
            </Tooltip>
            <Tooltip content='shortcut: Ctrl+S, Ctrl+D, or type two spaces at the end'>
                <Button isIconOnly variant='light'
                    onPress={() => {
                        if (refAudio.current!.paused) {
                            item.playMedia(refAudio.current!, false)
                        } else {
                            refAudio.current!.pause()
                        }
                    }}
                >
                    <MdPlayCircle size={30} />
                </Button>
            </Tooltip>
            <Tooltip isOpen={stateTips} placement='top'
                className='bg-slate-300'
                content={
                    <div className='flex flex-col items-start justify-start text-xl px-4 py-2'>
                        <div>{getTip(stateInput)}</div>
                        {item.translation_list.length > 0 && (
                            <pre>
                                {item.translation_list.join('\n').replaceAll(/\d/g, 'x')}
                            </pre>
                        )}
                    </div>
                }
            >
                <Input aria-label='input answer' variant='bordered'
                    id={`d-s-i-${index}`}
                    classNames={{ input: 'text-xl font-bold' }}
                    value={stateInput}
                    onChange={(e) => {
                        const content = e.target.value
                        if (content.endsWith('  ')) {
                            if (refAudio.current!.paused) {
                                item.playMedia(refAudio.current!, false)
                            } else {
                                refAudio.current!.pause()
                            }
                        } else {
                            // ❚ ▪ ◾ • 🔹
                            setStateInput(content)
                            if (!stateSuccess && isSuccess(content))
                                setStateSuccess(true)
                            if (stateSuccess && !isSuccess(content))
                                setStateSuccess(false)
                        }
                    }}
                    onFocus={(e) => { setStateTips(true) }}
                    onBlur={(e) => { setStateTips(false) }}
                    onKeyDown={(e) => {
                        if (e.ctrlKey && 'sS'.includes(e.key)) {
                            if (refAudio.current!.paused) {
                                item.playMedia(refAudio.current!, false)
                            } else {
                                refAudio.current!.pause()
                            }
                            e.preventDefault()
                        }
                        if (e.ctrlKey && 'dD'.includes(e.key)) {
                            if (refAudio.current!.paused) {
                                item.playMedia(refAudio.current!, true)
                            } else {
                                refAudio.current!.pause()
                            }
                            e.preventDefault()
                        }
                    }}
                />
            </Tooltip>
            <Popover placement='top-end' classNames={{ content: 'bg-slate-200' }} >
                <Tooltip color="danger" content="show answer">
                    {/**
                     * https://github.com/nextui-org/nextui/issues/1265
                     * Tooltip and Popover cannot share the same DOM element as trigger element.
                     * A workaround is to add an extra element inside the Tooltip. Keep in mind that the focus state will be handled differently.
                     */}
                    <div className="max-w-fit">
                        <PopoverTrigger>
                            <Button isIconOnly variant='light' >
                                <MdHelp size={30} />
                            </Button>
                        </PopoverTrigger>
                    </div>
                </Tooltip>
                <PopoverContent>
                    <div className='text-xl px-4 py-2'>
                        {item.content_list}
                    </div>
                </PopoverContent>
            </Popover>
            <Tooltip color='primary' content="add to my examples">
                <Button isIconOnly variant='light' as={Link} target='_blank'
                    href={`/word/example/add?content=${encodeURIComponent(item.content())}`}
                >
                    <MdFavorite size={20} />
                </Button>
            </Tooltip>
        </div>)
    );
}
