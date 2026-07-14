// .vitepress/theme/index.ts
// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import type { Theme } from 'vitepress'

// 1. 引入官方猫咪皮肤（深色摩卡风味 + 薰衣草紫强调色）
import "@catppuccin/vitepress/theme/mocha/pink.css";

// 2. 🌟 引入你自己的自定义样式文件！名字对上就完全没问题
import './custom.css'; 

export default {
  extends: DefaultTheme,
} satisfies Theme