import { auth } from '@/auth';
import React from 'react'
import { getBlogAllOfOthers } from '../../actions/blogActions';
import Blog from '../Blog';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function Page({ params, searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email || '';
  const result = await getBlogAllOfOthers(email)

  return (
    <>
      {(result.status === 'success') && (
        <Blog list={result.data} />
      )}
    </>
  )
}
