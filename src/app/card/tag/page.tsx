import { getTagAll, removeTag } from '@/app/actions/cardActions';
import { auth } from '@/auth';
import { Button } from "@heroui/react";
import Link from 'next/link';
import React from 'react'
import Tag from './Tag';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function Page({ params, searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email || '';

  const result = await getTagAll(email);

  return (
    <div className='flex flex-col w-full gap-4 py-4'>
      <div className="flex flex-row w-full items-end justify-end gap-4">
        <Button as={Link} color='primary' target='_blank'
          href={`/card/tag/add`}
        >
          Add New
        </Button>
      </div>

      {result.status === 'success' && result.data.map((v, i) => {
        return <Tag key={v.uuid} item={v} />
      })}
    </div>
  )
}
