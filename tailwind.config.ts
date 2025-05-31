import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  /*
  使用 Tailwind CSS 时最常见的错误（动态css构建后不生效）
  https://juejin.cn/post/7337309863158595599
  */
  safelist: [
    "bg-slate-200",
    "bg-red-200",
    "bg-orange-200",
    "bg-amber-200",
    "bg-cyan-200",
    "bg-green-200",
    "bg-lime-200",
    // 列出所有动态生成的类
  ],
  theme: {
    fontFamily: {
      'roboto': ['Roboto', 'RobotoDraft', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
export default config;
