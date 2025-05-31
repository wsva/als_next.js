import { getTextCategory, getTextByDomain, getTextByOriginal } from '@/app/actions/wordActions'
import { formatDate } from '@/lib/utils';
import { Spacer } from "@heroui/react";
import Link from 'next/link';
import React from 'react'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function TextIndexPage({ params, searchParams }: Props) {
  const { domain, language, original } = searchParams;
  const is_single_original_view = (typeof original === 'string');
  const is_category_view = !is_single_original_view && !(
    typeof domain === 'string'
    && typeof language === 'string'
    && domain.length > 0
    && language.length > 0
  );


  const generateCategoryView = async () => {
    const result = await getTextCategory()
    if (result.status === 'success') {
      const list = result.data.sort((a, b) =>
        a.domain!.localeCompare(b.domain!) || a.language!.localeCompare(b.language!))
      return list.map((doc, index) => {
        return <Link key={index} target="_blank"
          className='flex m-4 text-2xl font-bold text-blue-600 hover:underline'
          href={`/word/text?domain=${doc.domain}&language=${doc.language}`}
        >
          {`${doc.domain}[${doc.language}]`}
        </Link>
      })
    }
  }

  const generateItemView = async () => {
    const result = is_single_original_view
      ? (await getTextByOriginal(original as string))
      : (await getTextByDomain(domain as string, language as string))
    if (result.status === 'success') {
      const list = result.data
        .sort((a, b) => a.source!.localeCompare(b.source!) || a.version! - b.version!)

      return list.map((v) => {
        return <Link key={v.uuid} target="_blank"
          className='flex mx-4 my-1 text-2xl text-blue-600 hover:underline'
          href={`/word/text/${v.uuid}`}
        >
          <div className='flex flex-col items-start'>
            <div>{`${v.source}`}</div>
            <div className='flex flex-row items-end text-sm ml-4'>
              {`version: ${v.version}`}
              <Spacer x={4} />
              {`by ${v.created_by}`}
              <Spacer x={4} />
              {`created at ${formatDate(v.created_at!)}`}
              <Spacer x={4} />
              {`updated at ${formatDate(v.updated_at!)}`}
            </div>
          </div>
        </Link>
      })
    }
  }

  return (
    <>
      {is_category_view ? generateCategoryView() : generateItemView()}
    </>
  )
}
