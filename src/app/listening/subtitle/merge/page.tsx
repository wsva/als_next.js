'use client'

import React, { useRef, useState } from 'react'
import {
    Button,
    ButtonGroup,
    Input,
} from "@heroui/react";
import { SRT } from '../../srt'
import { BiMinus, BiPlus } from 'react-icons/bi';

export default function Page() {
    const [stateSRTFilename, setStateSRTFilename] = useState<string>('')
    const [stateSRTContent, setStateSRTContent] = useState<string>('')
    const [stateSRT1, setStateSRT1] = useState<SRT.Item[]>([])
    const [stateSRT2, setStateSRT2] = useState<SRT.Item[]>([])
    const [stateSRTError, setStateSRTError] = useState<string>('')
    const [stateOffsite, setStateOffsite] = useState<number>(0)
    const [stateLoading, setStateLoading] = useState<boolean>(false)

    const refUploadHTML1 = useRef<HTMLInputElement>(null)
    const refUploadHTML2 = useRef<HTMLInputElement>(null)

    const parseSRT1 = (content: string) => {
        const result = SRT.parse_srt_content(content, false)
        if (result.status === 'success') {
            if (result.data.length > 0) {
                setStateSRT1(result.data)
                setStateSRTError('')
            }
        } else {
            setStateSRTError(result.error as string)
        }
    }

    const parseSRT2 = (content: string) => {
        const result = SRT.parse_srt_content(content, false)
        if (result.status === 'success') {
            if (result.data.length > 0) {
                setStateSRT2(result.data)
                setStateSRTError('')
                mergeSRT(stateSRT1, result.data)
            }
        } else {
            setStateSRTError(result.error as string)
        }
    }

    const mergeSRT = (list1: SRT.Item[], list2: SRT.Item[]) => {
        setStateLoading(true)
        const offset = stateOffsite
        const list = list1.map((v, i) => {
            v.translation_list = []
            let j = i + offset
            if (j >= 0 && j < list2.length) {
                v.translation_list.push(...list2[j].content_list)
            }
            return v
        })
        setStateSRTContent(SRT.build_srt_content(list))
        setStateLoading(false)
    }

    const handleDownload = () => {
        // Create a Blob with the content
        const blob = new Blob([stateSRTContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = stateSRTFilename;
        document.body.appendChild(link);
        link.click();

        // Clean up the URL object and remove the temporary anchor
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }

    return (
        <div className='flex flex-col gap-4 my-2'>
            <div className='flex flex-row my-1 items-center justify-center gap-4'>
                <Input className='hidden' type='file' ref={refUploadHTML1}
                    onChange={async (e) => {
                        const file = e.target.files![0]
                        setStateSRTFilename(file.name)
                        const content = (await file.text())
                            .trim().replaceAll('\r\n', '\n').replaceAll('\r', '\n')
                        let srt_lines: string[] = []
                        for (const line of content.split('\n')) {
                            if (srt_lines.length < 1 && line !== '1') {
                                continue
                            }
                            if (srt_lines.length > 0 && line.endsWith('`;')) {
                                break
                            }
                            srt_lines.push(line)
                        }
                        parseSRT1(srt_lines.join('\n'))
                    }}
                />
                <Button color="primary" variant="solid" isDisabled={stateSRT1.length > 0}
                    onPress={() => refUploadHTML1.current?.click()}
                >
                    select original subtitle
                </Button>

                <Input className='hidden' type='file' ref={refUploadHTML2}
                    onChange={async (e) => {
                        const file = e.target.files![0]
                        const content = (await file.text())
                            .trim().replaceAll('\r\n', '\n').replaceAll('\r', '\n')
                        let srt_lines: string[] = []
                        for (const line of content.split('\n')) {
                            if (srt_lines.length < 1 && line !== '1') {
                                continue
                            }
                            if (srt_lines.length > 0 && line.endsWith('`;')) {
                                break
                            }
                            srt_lines.push(line)
                        }
                        parseSRT2(srt_lines.join('\n'))
                    }}
                />
                <Button color="primary" variant="solid" isDisabled={stateSRT2.length > 0}
                    onPress={() => refUploadHTML2.current?.click()}
                >
                    select translated subtitle
                </Button>

                <Button color="primary" variant="solid" onPress={handleDownload}
                    isDisabled={!stateSRTFilename || !stateSRTContent}
                >
                    Download
                </Button>
            </div>

            <div className='flex flex-row my-1 items-center justify-center gap-4'>
                Set offsite of the second subtitle
                <ButtonGroup color="primary">
                    <Button isIconOnly isDisabled={stateLoading}
                        onPress={() => {
                            setStateOffsite(stateOffsite - 1)
                            mergeSRT(stateSRT1, stateSRT2)
                        }}
                    >
                        <BiMinus />
                    </Button>
                    <Input className='w-10' radius='none' color='primary' isDisabled
                        classNames={{ input: 'text-lg font-bold text-black' }}
                        value={`${stateOffsite}`} />
                    <Button isIconOnly isDisabled={stateLoading}
                        onPress={() => {
                            setStateOffsite(stateOffsite + 1)
                            mergeSRT(stateSRT1, stateSRT2)
                        }}
                    >
                        <BiPlus />
                    </Button>
                </ButtonGroup>
            </div>

            {stateSRTError.length > 0 && (
                <pre className='my-4 items-center justify-center'>
                    {stateSRTError}
                </pre>
            )}

            <pre className='my-4 items-center justify-center bg-slate-300 p-2'>
                {stateSRTContent}
            </pre>
        </div>
    )
}
