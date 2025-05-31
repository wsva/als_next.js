import { auth } from '@/auth';
import React from 'react'
import { getTagAll } from '@/app/actions/cardActions';
import CardMarket from './CardMarket';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function Page({ params, searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email || '';
  const user_id = typeof searchParams.user_id === 'string' ? searchParams.user_id : '';

  return (
    <CardMarket email={email} user_id={user_id} />
  )
}
