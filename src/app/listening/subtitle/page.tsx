'use client'

import { Button, Input, Textarea } from "@heroui/react"
import React, { useRef, useState } from 'react'
import { SRT } from '../srt'
import { BP } from '../breakpoint'

export default function DictationPage() {
    const [stateMediaURL, setStateMediaURL] = useState<string>()
    const [stateError, setStateError] = useState<string>('')
    const [stateSRTContent, setStateSRTContent] = useState<string>('')
    const [stateSRT, setStateSRT] = useState<SRT.Item[]>([])
    const [stateBreakpoint, setStateBreakpoint] = useState<number[]>([])

    const refUploadAudio = useRef<HTMLInputElement>(null)
    const refAudio = useRef<HTMLAudioElement>(null)

    const initSRT = (content: string) => {
        setStateSRTContent(content)
        const result = SRT.parse_srt_content(content, false)
        if (result.status === 'success') {
            if (result.data.length > 0) {
                setStateSRT(result.data)
                setStateError('')
            }
        } else {
            setStateError(result.error as string)
        }
    }

    const scrollToCurrentLine = () => {
        if (!refAudio.current) {
            return
        }
        const current_ms = refAudio.current.currentTime * 1000;

        for (let i = 0; i < stateSRT.length; i++) {
            if (current_ms <= stateSRT[i].end_ms) {
                const ds = document.getElementById(`d-s-i-${i}`);
                ds?.scrollIntoView({ behavior: "smooth", block: "center" });
                ds?.focus()
                break
            }
        }
    }

    refAudio.current?.addEventListener('timeupdate', scrollToCurrentLine)
    refAudio.current?.addEventListener('seeking', scrollToCurrentLine)

    return (
        <div>
            <pre>
                {`design:
1, upload a audio/video file, save to server disk
2, use shortcut to set breakpoints
3, generade srt edit view according to breakpoints
4, generate srt file

1, custom audio player, show wave
2, can manually set breakpoints using time-string
                `}
            </pre>
            {stateMediaURL && (
                <div className='flex flex-col items-start justify-start w-full gap-4 py-4 sticky top-0 z-50'
                    onMouseOver={(e) => {
                        refAudio.current!.focus()
                    }}
                    onKeyDown={(e) => {
                        if (e.ctrlKey && 'bB'.includes(e.key)) {
                            const current_ms = refAudio.current!.currentTime * 1000
                            setStateBreakpoint(BP.add(stateBreakpoint, current_ms))
                            e.preventDefault()
                        }
                    }}
                >
                    <audio className='w-full' ref={refAudio} controls src={stateMediaURL} />
                    <div className='text-sm text-red-400'>press Ctrl + B to set breakpoint</div>
                    <div>
                        {stateBreakpoint.map((v, i) => {
                            return (
                                <div key={i}>{v}</div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className='flex flex-row items-center justify-center gap-4'>
                <Input className='hidden' type='file' ref={refUploadAudio}
                    onChange={(e) => {
                        setStateMediaURL(URL.createObjectURL(e.target.files![0]))
                    }}
                />
                <Button variant='solid' color='primary'
                    onPress={() => refUploadAudio.current?.click()}
                >
                    upload audio/video
                </Button>
            </div>

            {stateError.length > 0 && (
                <pre className='my-4'>{stateError}</pre>
            )}


        </div>
    )
}
