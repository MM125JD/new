<script setup>
import { withBase } from 'vitepress'

defineProps({
  items: {
    type: Array,
    required: true
  }
})

// 判断是否是外部链接 (以 http 开头)
const isExternal = (url) => {
  return /^(http|https):\/\//.test(url)
}

// 处理链接路径，自动加上 base 前缀
const resolveLink = (url) => {
  if (!url) return ''
  if (isExternal(url)) return url
  return withBase(url)
}
</script>

<template>
  <div class="custom-features">
    <template v-for="(item, index) in items" :key="index">

      <!-- 情况 A：如果传了 link，渲染为一个可点击的 <a> 链接框 -->
      <a
        v-if="item.link"
        :href="resolveLink(item.link)"
        :target="isExternal(item.link) ? '_blank' : undefined"
        class="feature-card clickable"
      >
        <h3>{{ item.title }}</h3>
        <p v-html="item.details"></p>
      </a>

      <!-- 情况 B：如果没有传 link，依然渲染成普通的静态框 -->
      <div v-else class="feature-card">
        <h3>{{ item.title }}</h3>
        <p v-html="item.details"></p>
      </div>

    </template>
  </div>
</template>

<style scoped>
.custom-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.feature-card {
  padding: 20px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-gutter);
  text-decoration: none;
  color: inherit;
  display: block;
  transition: border-color 0.25s, transform 0.25s;
}
.feature-card h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}
.feature-card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 🎯 鼠标悬浮在“可点击卡片”上时的炫酷动效：边框变色 + 微微上浮 */
.feature-card.clickable:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  cursor: pointer;
}
</style>