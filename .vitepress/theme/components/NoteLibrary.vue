<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { data as notes } from '../posts.data.js'
const query = ref('')
const category = ref('全部')
const page = ref(1)
const categories = computed(() => [...new Set(notes.map(p => p.category))].sort((a,b) => a.localeCompare(b, 'zh-CN')))
const filtered = computed(() => notes.filter(p => (category.value === '全部' || p.category === category.value) && `${p.title} ${p.category}`.toLowerCase().includes(query.value.trim().toLowerCase())))
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / 12)))
const visible = computed(() => filtered.value.slice((page.value - 1) * 12, page.value * 12))
watch([query, category], () => { page.value = 1 })
onMounted(() => { const value = new URLSearchParams(location.search).get('category'); if (categories.value.includes(value)) category.value = value })
</script>
<template>
  <main class="note-library"><p class="eyebrow">THE COLLECTION</p><h1>笔记库<span>让想法，有处可寻。</span></h1><p class="library-intro">学习、生活与灵感，都收在这里。选一个主题，或搜索一篇笔记。</p>
  <label class="library-search"><span>搜索笔记</span><input v-model="query" type="search" placeholder="输入标题或主题…" /></label>
  <div class="category-filters" aria-label="按主题筛选"><button v-for="item in ['全部', ...categories]" :key="item" :aria-pressed="category === item" :class="{ active: category === item }" @click="category = item">{{ item }}</button></div>
  <p class="result-count" role="status">{{ category }} · {{ filtered.length }} 篇笔记</p>
  <div class="library-grid"><a v-for="note in visible" :key="note.url" :href="withBase(note.url)" class="library-card"><span class="eyebrow">{{ note.category }}</span><h2>{{ note.title }}</h2><div><small>{{ note.date || (note.type === 'ss' ? '资料收藏' : '学习记录') }}</small><span aria-hidden="true">↗</span></div></a></div>
  <div v-if="!filtered.length" class="empty-notes"><h2>暂时没有找到这篇笔记</h2><p>试试其他关键词，或返回全部主题。</p><button @click="query = ''; category = '全部'">清除筛选</button></div>
  <nav v-if="pages > 1" class="library-pagination" aria-label="笔记分页"><button :disabled="page === 1" @click="page--">上一页</button><span>{{ page }} / {{ pages }}</span><button :disabled="page === pages" @click="page++">下一页</button></nav>
  </main>
</template>
