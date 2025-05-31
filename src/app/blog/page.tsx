import { auth } from '@/auth';
import React from 'react'
import { getBlogAll } from '../actions/blogActions';
import Blog from './Blog';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function BlogIndexPage({ params, searchParams }: Props) {
  let { email } = searchParams;
  if (typeof email !== 'string') {
    const session = await auth();
    email = session?.user?.email || '';
  }

  const result = await getBlogAll(email)

  return (
    <>
      {(result.status === 'success') && (
        <Blog list={result.data} />
      )}
    </>
  )
}
