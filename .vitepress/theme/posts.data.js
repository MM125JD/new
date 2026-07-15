// posts.data.js
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export default {
    watch: ['../../{posts,ss}/**/*.md'],

    load(watchedFiles) {
        const projectRootDir = path.resolve(__dirname, '../../')

        return watchedFiles
            .map((filePath) => {
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                const { data } = matter(fileContent)

                // 计算相对路径，例如：ss/上的/未命名.md
                let relativePath = path.relative(projectRootDir, filePath)
                    .replace(/\\/g, '/') // 兼容 Windows 路径反斜杠

                relativePath = relativePath.replace(/\.md$/, '.html')
                const finalUrl = relativePath.startsWith('/') ? relativePath : '/' + relativePath

                // 💡 核心：提取子文件夹的名字作为分类（category）
                const pathParts = relativePath.split('/')
                let category = ''

                // 如果相对路径层级大于 2（比如：ss/上的/未命名.html，按 '/' 切分后长度为 3）
                if (pathParts.length > 2) {
                    category = pathParts[1] // 拿出来的就是 "上的" 或 "阳光"
                }

                return {
                    title: data.title || path.basename(filePath, '.md'),
                    url: finalUrl,
                    date: data.date || fs.statSync(filePath).mtime.toISOString().split('T')[0],
                    type: relativePath.startsWith('ss/') ? 'ss' : 'posts',
                    category: category // 👈 成功把分类传给前端
                }
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
}