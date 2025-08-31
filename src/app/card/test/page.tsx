import { getCardTest, getCardTestByUUID, getTagAll } from '@/app/actions/cardActions';
import { auth } from '@/auth';
import React from 'react'
import TestForm from './TestForm';
import { qsa_tag } from '@prisma/client';
import Link from 'next/link';

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
};

export default async function CardTestPage({ params, searchParams }: Props) {
    const session = await auth();
    const email = session?.user?.email || '';

    const tag_uuid = typeof searchParams.tag === 'string' ? searchParams.tag : '';
    let tag_list: qsa_tag[] = []
    if (!tag_uuid) {
        const result = await getTagAll(email);
        if (result.status === 'success') {
            tag_list = result.data
        }
    }

    const card_uuid = typeof searchParams.uuid === 'string' ? searchParams.uuid : '';
    const result = !!tag_uuid
        ? (!!card_uuid
            ? await getCardTestByUUID(card_uuid)
            : await getCardTest(email, tag_uuid))
        : undefined

    return (
        <>
            {!!tag_uuid
                ? ((result?.status === 'success')
                    ? <TestForm user_id={email} item={result.data} />
                    : <div className='text-2xl'>no card for test</div>)
                : <div className='flex flex-col items-start justify-center my-4'>
                    <div className='text-2xl'>
                        Select a tag as the scope
                    </div>
                    {tag_list.map((v) => {
                        return <Link key={v.uuid} target="_blank"
                            className='flex m-4 text-2xl font-bold text-blue-600 hover:underline'
                            href={`/card/test?tag=${v.uuid}`}>
                            {v.tag} {!!v.description ? `(${v.description})` : ''}
                        </Link>
                    })}
                </div>
            }
        </>
    )
}
