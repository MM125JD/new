import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar' // 注意：最新版函数名通常是 generateSidebar

export default defineConfig({
  title: "chenduiblog",
  description: "A VitePress Site",
  base: '/new/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' }
    ],

    // 关键点：改用默认的官方推荐方法名
    sidebar: generateSidebar({
      documentRootPath: '/',
      scanStartPath: 'posts',    // 只精准扫描 posts 文件夹
      resolvePath: '/',
      prefix: '/posts/',         // 关键点：官方正确的属性名是 prefix，用来在 URL 前面强行补上 /posts/
      collapsed: true,
    }),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})