import React from 'react'
import TagForm from './TagForm';
import { auth } from '@/auth';
import { getTag } from '@/app/actions/cardActions';

type Props = {
  params: { uuid: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function ExamplePage({ params, searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email || '';

  const result = (typeof params.uuid === 'string' && params.uuid !== 'add')
    ? (await getTag(params.uuid)) : undefined

  return (
    <>
      {(result?.status === 'success') ? (
        <TagForm item={result.data} email={email} />
      ) : (
        <TagForm email={email} />
      )}
    </>
  )
}
