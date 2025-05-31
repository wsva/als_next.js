'use server';
/**
 * 必须要加上 use server，否则在 user client 的组件中调用时会报错：
 * PrismaClient is unable to be run in the browser.
 */

import { prisma } from "@/lib/prisma";
import { ActionResult, original, sentence, text, word } from "@/lib/types";
import { checkSQLSafe, getUUID, getWordUserUUID, strSplit, getWeightedRandom } from "@/lib/utils";
import { Prisma, statistic_original, word_store, word_trash, statistic_correction_map } from '@prisma/client'

export async function getWordInStore(
    email: string,
    lang: string,
    page: number,
    limit: number,
): Promise<ActionResult<word[]>> {
    const skip = (page - 1) * limit
    const take = limit

    const sql_start = Prisma.sql`
        select * from word_store t0 where 1 = 1
    `
    const sql_start_count = Prisma.sql`
        select count(1) as total from word_store t0 where 1 = 1
    `
    const sql_body_trash = Prisma.sql`
        and not exists(select 1 from word_trash t1 where t1.word = t0.word)
    `
    const sql_body_card = !!email
        ? Prisma.sql`
            and not exists(select 1 from qsa_card t1
                where (t1.question = t0.word or t1.suggestion = t0.word) and t1.user_id = ${email})
        `
        : Prisma.sql``
    const sql_body_lang = !!lang
        ? Prisma.sql`
            and t0.language = ${lang}
        `
        : Prisma.sql``
    const sql_end_order_by = Prisma.sql`
        order by count desc, word asc
    `
    const sql_end_limit = Prisma.sql`
        limit ${take} offset ${skip}
    `

    try {
        const sql = Prisma.join([
            sql_start,
            sql_body_trash,
            sql_body_card,
            sql_body_lang,
            sql_end_order_by,
            sql_end_limit,
        ], " ")
        const result = await prisma.$queryRaw<word[]>(sql)

        /* // too slow
        const sql_count = Prisma.join([
            sql_start_count,
            sql_body_trash,
            sql_body_card,
            sql_body_lang,
        ], " ") */
        const sql_count = Prisma.sql`select count(1) as total from word_store`
        const result_count = await prisma.$queryRaw<{ total: BigInt }[]>(sql_count)
        const total = Number(result_count[0]?.total || 0)

        return {
            status: "success",
            data: result,
            total_records: total,
            page: page,
            total_pages: Math.ceil(total / limit),
        }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function searchWordInStore(
    email: string,
    lang: string,
    word: string,
    page: number,
    limit: number,
): Promise<ActionResult<word[]>> {
    const skip = (page - 1) * limit
    const take = limit

    const get_sql_start = (email: string, order: number) => {
        if (!!email) {
            return Prisma.sql`
                select t0.*,
                (select string_agg(t1.uuid, ',') from qsa_card t1 where 1 =1 
                    and (t1.question = t0.word or t1.suggestion = t0.word)
                    and t1.user_id = ${email}
                ) as card_uuid,
                ${order} as sort_order
                from word_store t0 where 1 = 1
            `
        }
        return Prisma.sql`
            select t0.*,
            null as card_uuid,
            ${order} as sort_order
            from word_store t0 where 1 = 1
        `
    }
    const word_clean = word.replaceAll(/\s+/g, " ").replaceAll(/^\s+|\s+$/g, "")
    const sql_body_exact = Prisma.sql`
        and lower(t0.word) = lower(${word_clean})
    `
    const sql_body_contain = Prisma.sql`
        and lower(t0.word) != lower(${word_clean})
        and lower(t0.word) like lower(${'%' + word_clean + '%'})
    `

    const sql_match = Prisma.join([
        get_sql_start(email, 1),
        sql_body_exact,
        Prisma.sql`union`,
        get_sql_start(email, 2),
        sql_body_contain
    ], " ")

    try {
        const sql = Prisma.join([
            Prisma.sql`select * from (`,
            sql_match,
            Prisma.sql`) as t`,
            Prisma.sql`order by sort_order`,
            Prisma.sql`limit ${take} offset ${skip}`,
        ], " ")
        const result = await prisma.$queryRaw<word[]>(sql)

        const sql_count = Prisma.join([
            Prisma.sql`select count(1) as total from (`,
            sql_match,
            Prisma.sql`) as t`,
        ], " ")
        const result_count = await prisma.$queryRaw<{ total: BigInt }[]>(sql_count)
        const total = Number(result_count[0]?.total || 0)

        return {
            status: "success",
            data: result,
            total_records: total,
            page: page,
            total_pages: Math.ceil(total / limit),
        }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getOriginalCategory(): Promise<ActionResult<original[]>> {
    try {
        const result = await prisma.statistic_original.findMany({
            distinct: ['domain', 'language'],
            select: {
                domain: true,
                language: true,
            },
        })
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getOriginalByDomain(domain: string, language: string): Promise<ActionResult<original[]>> {
    try {
        const result = await prisma.statistic_original.findMany({
            where: { domain, language },
            select: {
                uuid: true,
                source: true,
                domain: true,
                language: true,
            },
        })
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getOriginal(uuid: string): Promise<ActionResult<statistic_original>> {
    try {
        const result = await prisma.statistic_original.findUnique({
            where: { uuid }
        })
        if (!result) {
            return { status: 'error', error: 'no original found' }
        }
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getTextCategory(): Promise<ActionResult<Partial<statistic_original>[]>> {
    try {
        const result = await prisma.$queryRaw<
            ({ domain: string; language: string; })[]
        >(
            Prisma.sql`SELECT distinct t1.domain, t1.language
        FROM
        	statistic_text t0, statistic_original t1
        WHERE
            t0.original_uuid = t1.uuid
        `
        )
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getTextByDomain(domain: string, language: string): Promise<ActionResult<text[]>> {
    if (!checkSQLSafe(domain)) {
        return { status: 'error', error: 'invaid sql param' }
    }
    if (!checkSQLSafe(language)) {
        return { status: 'error', error: 'invaid sql param' }
    }
    try {
        const result = await prisma.$queryRaw<text[]>(
            Prisma.sql`SELECT t1.source source, t1.domain, t1.language,
        t0.uuid, t0.version, '' content, t0.created_by, t0.created_at, t0.updated_at
        FROM
        	statistic_text t0, statistic_original t1
        WHERE
            t0.original_uuid = t1.uuid
            and t1.domain = ${domain}
            and t1.language = ${language}
        `
        )
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getTextByOriginal(original_uuid: string): Promise<ActionResult<text[]>> {
    if (!checkSQLSafe(original_uuid)) {
        return { status: 'error', error: 'invaid sql param' }
    }
    try {
        const result = await prisma.$queryRaw<text[]>(
            Prisma.sql`SELECT t1.source source, t1.domain, t1.language,
        t0.uuid, t0.version, '' content, t0.created_by, t0.created_at, t0.updated_at
        FROM
        	statistic_text t0, statistic_original t1
        WHERE
            t0.original_uuid = t1.uuid
            and t0.original_uuid = ${original_uuid}
        `
        )
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function getText(uuid: string): Promise<ActionResult<text[]>> {
    if (!checkSQLSafe(uuid)) {
        return { status: 'error', error: 'invaid sql param' }
    }
    try {
        const result = await prisma.$queryRaw<text[]>(
            Prisma.sql`SELECT t1.source source, t0.* 
            FROM
                statistic_text t0, statistic_original t1
            WHERE
                t0.original_uuid = t1.uuid
                and t0.uuid=${uuid}
            `
        )
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function searchSentenceByKeyword(keywords: string[]): Promise<ActionResult<sentence[]>> {
    if (keywords.length == 0) {
        return { status: 'error', error: 'no keyword found' }
    }
    try {
        const sql_str = `SELECT t2.source source, t2.domain, t0.* 
            FROM
                statistic_sentence t0, statistic_text t1, statistic_original t2
            WHERE
                t0.text_uuid = t1.uuid
                and t1.original_uuid = t2.uuid
                ${keywords.map((v) => `and LOWER(t0.sentence) like '%${v.toLowerCase()}%'`).join(' ')}
                limit 100
            `
        const result = await prisma.$queryRaw<sentence[]>(
            Prisma.sql([sql_str])
        )
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function searchSentenceByLemma(lemmas: string[]): Promise<ActionResult<sentence[]>> {
    if (lemmas.length == 0) {
        return { status: 'error', error: 'no keyword found' }
    }
    try {
        const sql_str = `SELECT t2.source source, t2.domain, t0.* 
            FROM
                statistic_sentence t0, statistic_text t1, statistic_original t2
            WHERE
                t0.text_uuid = t1.uuid
                and t1.original_uuid = t2.uuid
                and exists (select 1 from statistic_lemma t3
                        where t3.sentence_uuid = t0.uuid
                        ${lemmas.map((v) => `and t3.lemma = '${v}'`).join(' ')}
                    )
                limit 100
            `
        const result = await prisma.$queryRaw<sentence[]>(
            Prisma.sql([sql_str])
        )
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function trashWord(word: string, email: string): Promise<ActionResult<word_trash>> {
    try {
        const result = await prisma.word_trash.create({
            data: {
                uuid: getUUID(),
                word,
                created_by: email,
                created_at: new Date(),
                updated_at: new Date(),
            }
        })
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}

export async function saveCorrectionMap(item: statistic_correction_map): Promise<ActionResult<statistic_correction_map>> {
    try {
        const result = await prisma.statistic_correction_map.create({ data: item })
        return { status: "success", data: result }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: (error as object).toString() }
    }
}