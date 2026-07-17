<!-- .vitepress/theme/components/AudioList.vue -->
<script setup>
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'

// 接收外部传入的录音文件名数组
const props = defineProps({
  audios: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 1. 分页基本配置
const currentPage = ref(1)
const pageSize = 5 // 每 5 个换一页

// 2. 计算总页数
const totalPages = computed(() => {
  return Math.ceil(props.audios.length / pageSize)
})

// 3. 核心：切片截取当前页要显示的 5 个音频
const paginatedAudios = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return props.audios.slice(start, end)
})

// 4. 翻页控制
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div class="audio-list-container">
    <p class="audio-summary">🎵 录音总数：{{ audios.length }} 个（当前第 {{ currentPage }}/{{ totalPages }} 页）</p>

    <!-- 🎧 录音列表区域：只渲染当前页的 5 个 -->
    <div class="audio-grid">
      <div v-for="(audioName, index) in paginatedAudios" :key="audioName + index" class="audio-card">

        <!-- 💡 关键改动：外面单独占一行的标题 div 已经删掉 -->

        <!-- 💡 将文件名动态绑定给 :title，让它无缝进入播放器内部，并用 withBase 拼接路径 -->
        <AudioPlayer
          :title="audioName"
          :src="withBase(`/audios/${audioName}`)"
        />

      </div>
    </div>

    <!-- 🎮 分页控制栏（超过 5 个才显示） -->
    <div class="pagination-controls" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
        上一页
      </button>
      <span class="page-indicator">第 {{ currentPage }} / {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
.audio-list-container {
  margin: 20px 0;
}
.audio-summary {
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
}
.audio-grid {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 缩减卡片间距，排版更紧凑 */
}

/* 融入背景的卡片样式 */
.audio-card {
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* 分页控制按钮样式 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 25px;
}
.page-btn {
  background-color: #ffb7c5; /* 粉色翻页按钮 */
  color: #333;
  border: none;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: opacity 0.2s;
}
.page-btn:disabled {
  background-color: #e0e0e0;
  color: #a0a0a0;
  cursor: not-allowed;
}
.page-btn:not(:disabled):hover {
  opacity: 0.9;
}
.page-indicator {
  font-size: 14px;
  color: #666;
}
</style>