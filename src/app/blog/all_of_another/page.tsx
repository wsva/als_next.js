import React from 'react'
import {  getBlogAllOfAnother } from '../../actions/blogActions';
import Blog from '../Blog';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function Page({ params, searchParams }: Props) {
  const { user_id } = searchParams;
  const result = await getBlogAllOfAnother(user_id as string)

  return (
    <>
      {(result.status === 'success') && (
        <Blog list={result.data} />
      )}
    </>
  )
}
