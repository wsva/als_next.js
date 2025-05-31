import { getOriginalCategory, getOriginalByDomain } from '@/app/actions/wordActions'
import Link from 'next/link';
import React from 'react'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function OriginalIndexPage({ params, searchParams }: Props) {
  const { domain, language } = searchParams;
  const is_category_view = !(
    typeof domain === 'string'
    && typeof language === 'string'
    && domain.length > 0
    && language.length > 0
  );

  const generateCategoryView = async () => {
    const result = await getOriginalCategory()
    if (result.status === 'success') {
      const list = result.data.sort((a, b) =>
        a.domain!.localeCompare(b.domain!) || a.language!.localeCompare(b.language!))
      return list.map((doc, index) => {
        return <Link key={index} target="_blank"
          className='flex m-4 text-2xl font-bold text-blue-600 hover:underline'
          href={`/word/original?domain=${doc.domain}&language=${doc.language}`}
        >
          {`${doc.domain}[${doc.language}]`}
        </Link>
      })
    }
  }

  const generateItemView = async () => {
    const result = await getOriginalByDomain(domain as string, language as string)
    if (result.status === 'success') {
      const list = result.data
        .sort((a, b) => a.source!.localeCompare(b.source!))
      return list.map((v) => {
        return <div key={v.uuid} className='flex flex-row items-end my-1 gap-4'>
          <Link target="_blank"
            className='text-2xl text-blue-600 hover:underline'
            href={`/word/original/${v.uuid}`}
          >
            {v.source}
          </Link>
          <Link target="_blank"
            className='text-md text-blue-600 bg-yellow-100 hover:underline'
            href={`/word/text?original=${v.uuid}`}
          >
            text
          </Link>
        </div>
      })
    }
  }

  return (
    <>
      {is_category_view ? generateCategoryView() : generateItemView()}
    </>
  )
}
