import { defineConfig } from 'vitepress'
import callouts from 'markdown-it-obsidian-callouts'
import taskLists from 'markdown-it-task-lists'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
function sidebar(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true })
    .filter(item => !item.name.startsWith('.'))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name, 'zh-CN'))
    .flatMap(item => {
      const relative = `${dir}/${item.name}`
      if (item.isDirectory()) {
        const items = sidebar(relative)
        return items.length ? [{ text: item.name, collapsed: true, items }] : []
      }
      return item.name.endsWith('.md') ? [{ text: item.name.replace(/\.md$/, ''), link: '/' + relative.replace(/\.md$/, '') }] : []
    })
}
export default defineConfig({
  lang: 'zh-CN', title: '阳光笔记', description: '记录学习，整理生活，收藏灵感。一个持续生长的个人数字花园。', base: '/new/',
  srcExclude: ['**/.obsidian/**', '**/node_modules/**'],
  markdown: { image: { lazyLoading: true }, config(md) {
    md.inline.ruler.before('image', 'obsidian_audio', (state, silent) => {
      const match = /^!\[\[([^\]]+\.mp3)\]\]/.exec(state.src.slice(state.pos))
      if (!match) return false
      if (!silent) {
        const name = match[1].split('/').pop() || ''
        state.push('html_inline', '', 0).content = `<AudioPlayer src="/new/audios/${encodeURIComponent(name)}" title="${md.utils.escapeHtml(name)}" />`
      }
      state.pos += match[0].length
      return true
    })
    md.use(taskLists); md.use(callouts)
  } },
  themeConfig: {
    siteTitle: '阳光笔记',
    nav: [{ text: '首页', link: '/' }, { text: '笔记库', link: '/library' }, { text: '资料目录', link: '/母列表' }],
    sidebar: { '/posts/': sidebar('posts'), '/ss/': sidebar('ss') },
    outline: { level: [2, 3], label: '本页目录' },
    search: { provider: 'local', options: { locales: { root: { translations: { button: { buttonText: '搜索笔记', buttonAriaLabel: '搜索笔记' }, modal: { noResultsText: '没有找到相关笔记', resetButtonTitle: '清除搜索', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } } } } } } },
    socialLinks: [{ icon: 'github', link: 'https://github.com/MM125JD/new' }],
    docFooter: { prev: '上一篇', next: '下一篇' }, lastUpdated: { text: '更新于' },
    darkModeSwitchLabel: '外观', lightModeSwitchTitle: '切换浅色模式', darkModeSwitchTitle: '切换深色模式', sidebarMenuLabel: '文章目录', returnToTopLabel: '返回顶部'
  }
})
