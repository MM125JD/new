// .vitepress/theme/posts.data.js
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter' // 用于解析 Markdown 顶部的 Frontmatter (需 npm i gray-matter -D)

export default {
    // 1. watch 允许你指定要监听的文件，本地开发时这些文件变了，数据会自动热更新
    watch: ['../../posts/**/*.md'],

    // 2. load 函数是核心，它只在构建或开发服务器启动时运行
    load(watchedFiles) {
        // watchedFiles 是一个包含所有匹配到的 md 文件绝对路径的数组
        return watchedFiles
            .map((filePath) => {
                // 读取文件内容
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                // 解析 Markdown 顶部的 Frontmatter 数据
                const { data } = matter(fileContent)

                // 获取文件的相对路径，方便用于生成超链接
                const relativePath = path.relative(path.resolve(__dirname, '../../'), filePath)
                    .replace(/\\/g, '/') // 兼容 Windows 路径
                    .replace(/\.md$/, '.html') // 将 .md 转换为打包后的 .html

                // 返回你想暴露给页面的单个文章元数据
                return {
                    title: data.title || path.basename(filePath, '.md'), // 优先使用 frontmatter 里的 title
                    url: '/' + relativePath,
                    date: data.date || fs.statSync(filePath).mtime.toISOString().split('T')[0] // 优先使用 frontmatter 日期，否则用文件最后修改时间
                }
            })
            // 按照日期从新到旧排序
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
}