import { statistic_original, statistic_text, statistic_sentence, word_store, qsa_card, qsa_tag } from "@prisma/client";
import { ZodIssue } from "zod";

type ActionResult<T> = {
    status: "success",
    data: T,
    total_records?: number,
    page?: number,
    total_pages?: number,
} | {
    status: "error",
    error: string | ZodIssue[],
}

type original = Partial<statistic_original>
type text = Partial<statistic_text> & { source?: string; domain?: string; language?: string; }
//type sentence = Partial<statistic_sentence> & { source?: string; domain?: string; language?: string; }
//type example = Partial<word_example> & { lemma_list?: string }
// type example = Partial<statistic_sentence>
//     & Partial<word_example>
//     & {
//         source?: string;
//         domain?: string;
//         language?: string;
//         lemma_list?: string;
//     }
type sentence = Partial<statistic_sentence>
    & {
        source?: string;
        domain?: string;
    }
// 为什么 type word = Partial<word_store & word_user> 不行呢？
//  type word = Partial<word_store> & Partial<word_user>
type word = Partial<word_store> & {
    card_uuid?: string;
}
//  type word_test = {
//      word: word_user,
//      examples: example[],
//  }

type card_ext = Partial<qsa_card> & {
    tag_list_added?: string[];
    tag_list_new?: string[];
    tag_list_remove?: string[];
    tag_list_suggestion?: string[];
}

type card_sm2 = qsa_card & {
    interval_days?: number;  // 上一次的间隔
    ease_factor?: number;    // 难度系数
    repetitions?: number;   // 连续答对次数
    familiarity?: number;
    last_review_at?: Data;
    next_review_at?: Data;
}
