import React from 'react'
import CardFilter from './CardFilter';
import { auth } from '@/auth';
import { getTagAll } from '@/app/actions/cardActions';

type Props = {
  params: { uuid: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function Page({ params, searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email || '';

  const result = await getTagAll(email)
  const tag_list = result.status === 'success' ? result.data : []

  return (
    <CardFilter email={email} tag_list={tag_list} />
  )
}
