/**
 * SM-2 是 Anki 和 SuperMemo 常用的记忆调度算法，比固定间隔更智能，
 * 因为它会根据用户答题质量动态调整复习间隔和难度系数（ease factor）。
 */

/**
 * SM-2 核心原理
 * 
 * 在 Anki 中，每次复习时用户会打一个分数（0~5），代表记忆程度：
 * 5: 完全正确且轻松
 * 4: 正确，有一点犹豫
 * 3: 正确但比较吃力
 * 2: 错误，但还是有些印象
 * 1: 错误，几乎没印象
 * 0: 完全忘记
 * 
 * 评分 < 3: 重置为阶段 1（间隔 = 1 天）
 * 评分 ≥ 3:
 *   如果是第一次复习（阶段 1）: 间隔设为 1 天
 *   如果是第二次复习（阶段 2）: 间隔设为 6 天
 *   否则: interval = previous_interval * ease_factor
 *   调整 ease_factor:
 *     EF = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
 *     如果 EF < 1.3，则 EF = 1.3
 */

import { card_sm2 } from "@/lib/types";

/**
 * SM-2 算法实现
 * @param card - 需要更新的卡片
 * @param grade - 用户评分（0~5）
 */
export function updateSM2(card: card_sm2, grade: number): card_sm2 {
  let { repetitions, interval_days, ease_factor } = card;

  if (grade < 3) {
    // 回答错误
    repetitions = 0;
    interval_days = 1;
  } else {
    if (repetitions === 0) {
      interval_days = 1;
    } else if (repetitions === 1) {
      interval_days = 6;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }
    repetitions += 1;
  }

  // 调整 EF
  ease_factor = ease_factor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (ease_factor < 1.3) {
    ease_factor = 1.3;
  }

  const next_review_at = new Date();
  next_review_at.setDate(next_review_at.getDate() + interval_days);

  return {
    ...card,
    repetitions,
    interval_days,
    ease_factor,
    last_review_at: new Date(),
    next_review_at,
  };
}
