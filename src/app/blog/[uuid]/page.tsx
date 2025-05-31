import React from 'react'
import BlogForm from './BlogForm';
import { auth } from '@/auth';
import { getBlog } from '@/app/actions/blogActions';

type Props = {
  params: { uuid: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function ExamplePage({ params, searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email || '';

  const result = (typeof params.uuid === 'string' && params.uuid !== 'add')
    ? (await getBlog(params.uuid)) : undefined

  return (
    <>
      {(!!result && result.status === 'success') ? (
        <BlogForm item={result.data} email={email} edit_view={false} />
      ) : (
        <BlogForm email={email} edit_view={true} />
      )}
    </>
  )
}
