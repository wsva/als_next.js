import { getOriginal } from '@/app/actions/wordActions';
import Link from 'next/link';
import React from 'react'

type Props = {
  params: { uuid: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function OriginalDetailPage({ params, searchParams }: Props) {
  const result = await getOriginal(params.uuid)

  return (
    <>
      {(result.status === 'success') && (
        <>
          <div className='text-2xl'>source: {result.data.source}</div>
          <Link target="_blank"
            className='flex mx-4 my-1 text-2xl text-blue-600 hover:underline'
            href={`/word/text?original=${params.uuid}`}
          >
            view preprocessed text
          </Link>

          <pre className='bg-slate-300 rounded-md p-2 my-4 text-wrap'>
            {result.data.content}
          </pre>
        </>
      )}
    </>
  )
}
