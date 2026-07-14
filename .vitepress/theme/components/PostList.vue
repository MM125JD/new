<!-- .vitepress/theme/components/PostList.vue -->
<script setup>
// 导入 withBase 方法，用于自动拼接基础路径 (如 /new)
import { data as posts } from '../posts.data.js'
import { withBase } from 'vitepress'
</script>

<template>
  <div class="post-list-container">
    <h3>📂 最新笔记索引（共 {{ posts.length }} 篇）</h3>
    <ul>
      <li v-for="post in posts" :key="post.url" class="post-item">
        <span class="post-date">[{{ post.date }}]</span>
        <!-- 💡 核心修改：使用 withBase 包裹 url -->
        <a :href="withBase(post.url)" class="post-link">{{ post.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 保持你的样式不变... */
</style>