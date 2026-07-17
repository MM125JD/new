<!-- .vitepress/theme/components/AudioPlayer.vue -->
<template>
  <div class="custom-audio-player">
    <!-- 隐藏的原生 audio 标签，通过 ref 绑定进行控制 -->
    <audio
      ref="audioRef"
      :src="src"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    ></audio>

    <div class="player-body">
      <!-- 播放/暂停 按钮 -->
      <button class="play-btn" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" class="icon">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" class="icon">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
        </svg>
      </button>

      <!-- 核心内容区：标题与进度条 -->
      <div class="player-info">
        <div class="audio-title" v-if="title">{{ title }}</div>

        <div class="progress-container">
          <!-- 进度条 -->
          <input
            type="range"
            class="progress-bar"
            min="0"
            :max="duration"
            step="0.1"
            :value="currentTime"
            @input="onProgressInput"
          />
          <!-- 时间显示 -->
          <div class="time-display">
            <span>{{ formatTime(currentTime) }}</span>
            <span>/</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  src: String,
  title: {
    type: String,
    default: '未命名录音'
  }
})

const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// 播放与暂停切换
const togglePlay = () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play().catch(err => console.log("播放失败:", err))
    isPlaying.value = true
  }
}

// 监听音频播放进度更新
const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

// 监听音频元数据加载完成（获取总时长）
const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration
  }
}

// 播放结束重置状态
const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

// 拖拽/点击进度条
const onProgressInput = (e) => {
  const targetTime = parseFloat(e.target.value)
  if (audioRef.value) {
    audioRef.value.currentTime = targetTime
    currentTime.value = targetTime
  }
}

// 格式化时间 (例如 75秒 -> 01:15)
const formatTime = (time) => {
  if (isNaN(time)) return '00:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 组件销毁前暂停音频
onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<style scoped>
.custom-audio-player {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.custom-audio-player:hover {
  border-color: var(--vp-c-brand-1);
}

.player-body {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 播放按钮样式 */
.play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  flex-shrink: 0;
}

.play-btn:hover {
  transform: scale(1.05);
  background-color: var(--vp-c-brand-2);
}

.icon {
  width: 20px;
  height: 20px;
}

/* 进度条与信息区 */
.player-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.audio-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex-grow: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-divider);
  outline: none;
  cursor: pointer;
  accent-color: var(--vp-c-brand-1); /* 完美同步 VitePress 主题色 */
}

.time-display {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 4px;
  font-variant-numeric: tabular-nums; /* 防止数字变动时字体抖动 */
}
</style>