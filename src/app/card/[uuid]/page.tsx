import React from 'react'
import CardForm from './CardForm';
import { auth } from '@/auth';
import { getCard } from '@/app/actions/cardActions';

type Props = {
  params: { uuid: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

export default async function ExamplePage({ params, searchParams }: Props) {
  const session = await auth();
  const email = session?.user?.email || '';

  const question = typeof searchParams.question === 'string'
    ? decodeURIComponent(searchParams.question) : ''
  const tags = typeof searchParams.tags === 'string'
    ? decodeURIComponent(searchParams.tags) : ''
  const suggestion = typeof searchParams.suggestion === 'string'
    ? decodeURIComponent(searchParams.suggestion) : ''
  const answer = typeof searchParams.answer === 'string'
    ? decodeURIComponent(searchParams.answer) : ''
  const note = typeof searchParams.note === 'string'
    ? decodeURIComponent(searchParams.note) : ''
  const simple = 'simple' in searchParams
  const card = { question, suggestion, answer, note, tag_list_suggestion: tags.split(",") }

  const result = (typeof params.uuid === 'string' && params.uuid !== 'add')
    ? (await getCard(params.uuid)) : undefined

  return (
    <>
      {(result?.status === 'success') ? (
        <CardForm card_ext={result.data} email={email} edit_view={!!searchParams.edit} simple={false} />
      ) : (
        <CardForm card_ext={card} email={email} edit_view={!!searchParams.edit} simple={simple} />
      )}
    </>
  )
}
