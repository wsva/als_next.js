import { sentence } from '@/lib/types';
import Link from 'next/link';
import React from 'react'

type Props = {
    list: sentence[];
    email?: string;
}

export default function SentenceList({ list, email }: Props) {
    return (
        <div className="flex flex-col w-full gap-4 py-4" >
            {list.map((v) => {
                return <div key={v.uuid!}
                    className="flex flex-col w-full items-start bg-slate-200 rounded-md p-1"
                >
                    {v.sentence && (
                        <div className="text-xl whitespace-pre-wrap" >{v.sentence}</div>
                    )}
                    {v.source && (
                        <div className="text-base" >{v.source}</div>
                    )}
                    <div className="flex flex-row w-full items-end justify-end gap-4">
                        <Link className='text-blue-600 hover:underline' target='_blank'
                            href={`/word/text/${v.text_uuid}`}
                        >
                            View in Text
                        </Link>
                        <Link className='text-blue-600 hover:underline' target='_blank'
                            href={`/card/add?edit=y&content=${encodeURIComponent(v.sentence!)}`}
                        >
                            Add to Cards
                        </Link>
                    </div>
                </div>
            })}
        </div>
    )
}
