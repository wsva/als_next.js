import React from 'react'
import Search from './Search';

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function Page({ params, searchParams }: Props) {
  return (
    <Search
      keyword={decodeURIComponent(searchParams.keyword
        ? (typeof searchParams.keyword === 'string'
          ? searchParams.keyword : searchParams.keyword[0])
        : '')}
      lemma={decodeURIComponent(searchParams.lemma
        ? (typeof searchParams.lemma === 'string'
          ? searchParams.lemma : searchParams.lemma[0])
        : '')}
    />
  )
}
