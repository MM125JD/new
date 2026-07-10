// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css' // 引入你的自定义样式

export default {
  extends: DefaultTheme,
  // 如果以后需要注册全局组件或引入其他插件，可以在这里扩展 enhaceApp
} satisfies Theme