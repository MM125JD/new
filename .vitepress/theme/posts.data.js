import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
export default {
  watch: ['../../posts/**/*.md', '../../ss/**/*.md'],
  load(files) {
    const root = path.resolve(__dirname, '../..')
    return files.filter(file => !path.relative(root, file).split(/[\\/]/).some(part => part.startsWith('.'))).map(file => {
      const relative = path.relative(root, file).replace(/\\/g, '/')
      const parts = relative.split('/')
      const { data } = matter(fs.readFileSync(file, 'utf8'))
      const parsed = data.date ? new Date(data.date) : null
      return { title: data.title || path.basename(file, '.md'), url: '/' + relative.replace(/\.md$/, '.html'), date: parsed && !Number.isNaN(parsed.valueOf()) ? parsed.toISOString().slice(0, 10) : '', type: parts[0], category: parts.length > 2 ? parts[1] : '未分类' }
    }).sort((a,b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'zh-CN'))
  }
}
