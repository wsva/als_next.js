import { getText } from '@/app/actions/wordActions';
import Link from 'next/link';
import React from 'react'

type Props = {
  params: { uuid: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function TextDetailPage({ params, searchParams }: Props) {
  const result = await getText(params.uuid)

  return (
    <>
      {(result.status === 'success' && result.data.length > 0) && (
        <>
          <Link target="_blank"
            className='flex mx-4 my-1 text-2xl text-blue-600 hover:underline'
            href={`/word/original/${result.data[0].original_uuid}`}
          >
            {result.data[0].source}
          </Link>
          <pre className='bg-slate-300 rounded-md p-2 my-4 text-wrap'>
            {result.data[0].content}
          </pre>
        </>
      )}
    </>
  )
}
