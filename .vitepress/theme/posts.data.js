// posts.data.js
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export default {
    watch: ['../../posts/**/*.md'],

    load(watchedFiles) {
        // 获取项目真正的根目录绝对路径（yangguangblog 目录）
        const projectRootDir = path.resolve(__dirname, '../../')

        return watchedFiles
            .map((filePath) => {
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                const { data } = matter(fileContent)

                // 1. 计算文件相对于项目根目录（yangguangblog）的相对路径
                // 这样可以确保路径结构长得像 "posts/JavaScript/浏览器贴纸.md"
                let relativePath = path.relative(projectRootDir, filePath)
                    .replace(/\\/g, '/') // 兼容 Windows 的反斜杠 \

                // 2. 将末尾的 .md 替换为 .html
                relativePath = relativePath.replace(/\.md$/, '.html')

                // 3. ⚠️ 核心修复：确保路径前面有斜杠 "/"
                const finalUrl = relativePath.startsWith('/') ? relativePath : '/' + relativePath

                return {
                    title: data.title || path.basename(filePath, '.md'),
                    url: finalUrl, // 最终生成的链接，例如：/posts/JavaScript/浏览器贴纸.html
                    date: data.date || fs.statSync(filePath).mtime.toISOString().split('T')[0]
                }
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
}