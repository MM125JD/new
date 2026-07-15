// .vitepress/theme/index.ts
// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import type { Theme } from 'vitepress'
import { h } from 'vue'
// @ts-ignore
import GiscusComment from './components/GiscusComment.vue'

// 1. 引入官方猫咪皮肤（深色摩卡风味 + 薰衣草紫强调色）
import "@catppuccin/vitepress/theme/mocha/pink.css";

// 2. 🌟 引入你自己的自定义样式文件！名字对上就完全没问题
import './custom.css'; 

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // doc-after 是 VitePress 官方提供的插槽，代表在文档正文的下方注入内容
      //'doc-after': () => h(GiscusComment)
    })
  }

} satisfies Theme