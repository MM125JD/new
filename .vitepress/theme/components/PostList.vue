<!-- .vitepress/theme/components/PostList.vue -->
<script setup>
import { ref, computed } from 'vue' // 💡 新增：导入 ref 和 computed
// 导入 withBase 方法，用于自动拼接基础路径 (如 /new)
import { data as posts } from '../posts.data.js'
import { withBase } from 'vitepress'

// 💡 新增：分页控制逻辑
const currentPage = ref(1) // 当前页码，默认第一页
const pageSize = 5         // 每页显示的数量（5个）

// 💡 新增：计算总页数
const totalPages = computed(() => {
  return Math.ceil(posts.length / pageSize)
})

// 💡 新增：动态截取当前页要显示的 5 个录音/笔记
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return posts.slice(start, end)
})

// 💡 新增：翻页控制函数
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<template>
  <div class="post-list-container">
    <h3>📂 最新笔记索引（共 {{ posts.length }} 篇）</h3>
    <ul>
      <!-- 💡 核心修改：将原本的 posts 改为分页后的 paginatedPosts -->
      <li v-for="post in paginatedPosts" :key="post.url" class="post-item">
        <span class="post-date">[{{ post.date }}]</span>
        <!-- 💡 核心修改：使用 withBase 包裹 url -->
        <a :href="withBase(post.url)" class="post-link">{{ post.title }}</a>
      </li>
    </ul>

    <!-- 💡 新增：分页控制按钮（只有当总页数大于 1 时才显示） -->
    <div class="pagination-controls" v-if="totalPages > 1">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        上一页
      </button>

      <span class="page-indicator">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 保持你原本的样式不变... */

/* 💡 新增：分页组件的样式，直接追加在最下方即可 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  padding: 10px 0;
}

.page-btn {
  background-color: #3eaf7c;
  color: white;
  border: none;
  padding: 5px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.page-btn:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background-color: #4abf8a;
}

.page-indicator {
  font-size: 13px;
  color: #666;
}
</style>