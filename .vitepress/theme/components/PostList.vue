<!-- .vitepress/theme/components/PostList.vue -->
<script setup>
// 1. 像导入普通 js 模块一样导入数据，VitePress 会自动识别并注入打包后的数据
import { data as posts } from '../posts.data.js'
</script>

<template>
  <div class="post-list-container">
    <h3>📂 最新笔记索引（共 {{ posts.length }} 篇）</h3>
    <ul>
      <li v-for="post in posts" :key="post.url" class="post-item">
        <span class="post-date">[{{ post.date }}]</span>
        <a :href="post.url" class="post-link">{{ post.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.post-list-container {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-alt);
}
.post-item {
  margin: 8px 0;
  list-style: none;
}
.post-date {
  font-family: monospace;
  color: var(--vp-c-text-3);
  margin-right: 10px;
}
.post-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}
.post-link:hover {
  text-decoration: underline;
}
</style>