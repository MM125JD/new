import { defineConfig } from 'vitepress'
import callouts from 'markdown-it-obsidian-callouts'
import taskLists from 'markdown-it-task-lists'
import fs from 'fs'
import path from 'path'

// 自定义的高效扫描函数：只扫描 posts 文件夹并自动过滤隐藏文件夹
function getAutoSidebar() {
  const postsDir = path.resolve(__dirname, '../posts')

  // 如果文件夹还不存在，先返回空
  if (!fs.existsSync(postsDir)) return []

  // 读取 posts 下的所有第一层子文件夹（如：学习、日记）
  const categories = fs.readdirSync(postsDir).filter(file => {
    const fullPath = path.join(postsDir, file)
    return (
        fs.statSync(fullPath).isDirectory() &&
        !file.startsWith('.') // 完美过滤掉 .obsidian 和 .git
    )
  })

  // 把每个文件夹映射成侧边栏的分组（Group）
  return categories.map(category => {
    const categoryPath = path.join(postsDir, category)

    // 读取该分类文件夹下的所有 .md 文件
    const articles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.md'))

    return {
      text: category, // 侧边栏分组名称，比如“学习”
      collapsed: true,
      items: articles.map(article => {
        const nameWithoutExt = path.basename(article, '.md')
        return {
          text: nameWithoutExt, // 文章标题
          link: `/posts/${category}/${nameWithoutExt}` // 精准不丢失的路径
        }
      })
    }
  })
}

// 确保这里完整包裹并导出
export default defineConfig({
      title: "chenduiblog",
      description: "A VitePress Site",
      base: '/new/',

      // 👉 【修正】markdown 是顶层配置，必须移到 themeConfig 外面
    markdown: {
        lazyLoading: true,
        config: (md) => {
            // 拦截 ![[...mp3]] 双链
            md.inline.ruler.before('image', 'obsidian_audio', (state, silent) => {
                const regex = /^!\[\[([^\]]+\.mp3)\]\]/;
                const match = regex.exec(state.src.slice(state.pos));

                if (!match) return false;

                if (!silent) {
                    const rawFileName = match[1];
                    const fileName = rawFileName.split('/').pop() || '';

                    const token = state.push('html_inline', '', 0);
                    // ⭐ 核心修改：这里不再渲染原生的 <audio>，而是直接渲染你的全局 Vue 组件 <AudioPlayer />！
                    // 加上 /new 前缀，对文件名进行安全编码
                    const encodedFileName = encodeURIComponent(fileName);
                    token.content = `<AudioPlayer src="/new/audios/${encodedFileName}" title="${fileName}" />`;
                }

                state.pos += match[0].length;
                return true;
            });

            // 启用你原有的其他插件
            if (typeof taskLists !== 'undefined') md.use(taskLists);
            if (typeof callouts !== 'undefined') md.use(callouts);
        }
    },

      themeConfig: {
        // 这里的设置会对整个网站的“所有 Markdown 文件”同时生效！
        outline: {
          level: [1, 2],
          label: '本页大纲'
        },
    logo: '/hero-cat.png',
    nav: [
      { text: 'Home', link: '/' }
    ],

    // 采用官方的多侧边栏模式，动态加载动态扫描的数据
    sidebar: {

      '/posts/': getAutoSidebar()
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})