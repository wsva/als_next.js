import React from 'react'
import { auth } from '@/auth'
import WordStore from './WordStore'
import { Link } from "@heroui/react";

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
};

export default async function Page({ params, searchParams }: Props) {
    const session = await auth();
    const email = session?.user?.email || '';

    const language = searchParams.lang === "en" || searchParams.lang === "de"
        ? searchParams.lang : ""
    const keyword = typeof searchParams.keyword === "string"
        ? decodeURIComponent(searchParams.keyword) : ""

    return (
        <>
            {(language === "" && keyword === "")
                ? (
                    <div className='flex flex-col items-start my-1 gap-4 mt-2'>
                        <Link className='text-2xl text-blue-600 hover:underline'
                            href={`/word/store?lang=en`}
                        >
                            English (Englisch)
                        </Link>
                        <Link className='text-2xl text-blue-600 hover:underline'
                            href={`/word/store?lang=de`}
                        >
                            German (Deutsch)
                        </Link>
                    </div>
                )
                : (
                    <WordStore email={email} language={language} keyword={keyword} />
                )}
        </>

    )


}
