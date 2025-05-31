'use client'

import React, { useRef, useState } from 'react'
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Input,
} from "@heroui/react";
import { SRT } from '../../srt'
import { BiCaretDown } from 'react-icons/bi';

export default function Page() {
    const [stateWithTranslation, setStateWithTranslation] = useState<boolean>(false)
    const [stateSRTError, setStateSRTError] = useState<string>('')
    const [stateSRTFilename, setStateSRTFilename] = useState<string>('')
    const [stateSRTContent, setStateSRTContent] = useState<string>('')

    const refUploadHTML = useRef<HTMLInputElement>(null)

    const prepareSRT = (content: string) => {
        const result = SRT.parse_srt_content(content, stateWithTranslation)
        if (result.status === 'success') {
            if (result.data.length > 0) {
                setStateSRTContent(SRT.build_srt_content(result.data))
                setStateSRTError('')
            }
        } else {
            setStateSRTError(result.error as string)
        }
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
                <Input className='hidden' type='file' ref={refUploadHTML}
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
                        prepareSRT(srt_lines.join('\n'))
                    }}
                />
                <ButtonGroup variant='solid' color='primary'>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button>
                                select subtitle <BiCaretDown />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            className="max-w-[300px]"
                            selectionMode="single"
                            onSelectionChange={(keys) => {
                                if (keys.currentKey === 'no_translation') {
                                    setStateWithTranslation(false)
                                } else {
                                    setStateWithTranslation(true)
                                }
                                refUploadHTML.current?.click()
                            }}
                        >
                            <DropdownItem key="no_translation" description='This subtitle file does not contain translations.'>
                                No Translation
                            </DropdownItem>
                            <DropdownItem key="with_translation" description='This subtitle file contains translations.'>
                                With Translation
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </ButtonGroup>
                <Button
                    color="primary"
                    variant="solid"
                    onPress={handleDownload}
                    isDisabled={!stateSRTFilename || !stateSRTContent}
                >
                    Download
                </Button>
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
