import { saveCorrectionMap } from '@/app/actions/wordActions';
import { Button, Input, Link } from "@heroui/react";
import { statistic_correction_map } from '@prisma/client';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type Props = {
    lemma?: string;
}

export default function AddCorrectionMap({ lemma }: Props) {
    const { register, handleSubmit } = useForm<statistic_correction_map>();

    const onSubmit = async (formData: statistic_correction_map) => {
        const result = await saveCorrectionMap(formData)
        if (result.status === 'success') {
            toast.success(`correction added for ${formData.lemma}`)
        } else {
            toast.error(`add correction for ${formData.lemma} failed`)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col items-center gap-1'>
                <Input label='Word' variant='bordered' size='sm'
                    defaultValue={lemma} {...register('lemma')}
                />
                <Input label='Correction' variant='bordered' size='sm'
                    {...register('correction')} />
                <Link as='button' type='submit'
                    className='bg-blue-500 rounded-md text-slate-50 px-2'
                >
                    add to correction map
                </Link>
            </div>
        </form >
    )
}
