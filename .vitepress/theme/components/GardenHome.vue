<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as notes } from '../posts.data.js'
const categories = computed(() => [...new Set(notes.map(p => p.category))])
const topics = [
  { name: '学习与技术', category: '笔记', mark: '01', text: '代码、工具与知识，让每一次探索都有迹可循。' },
  { name: '生活与成长', category: '人生管理系统', mark: '02', text: '从休息到目标，慢慢建立自己的生活秩序。' },
  { name: '日常记录', category: '日记', mark: '03', text: '收集日常的灵感，也留住值得回看的瞬间。' }
]
const featured = computed(() => notes.filter(p => p.type === 'posts' && !/未命名|别删/.test(p.title)).slice(0, 5))
</script>
<template>
  <main class="garden-home">
    <section class="garden-hero">
      <div class="hero-copy">
        <p class="eyebrow"><span class="sun-dot"></span> 阳光的数字花园</p>
        <h1>把零散的想法，<br>写成生长的<span>日常。</span></h1>
        <p class="hero-intro">记录学习，整理生活，收藏灵感。<br>这里是我的笔记，也是一路探索留下的足迹。</p>
        <div class="hero-actions"><a class="primary-link" :href="withBase('/library')">走进笔记库 <span aria-hidden="true">↗</span></a><a class="quiet-link" href="#topics">按主题探索 <span aria-hidden="true">↓</span></a></div>
        <p class="garden-stats">{{ notes.length }} 篇记录 <span>／</span> {{ categories.length }} 个主题 <span>／</span> 持续积累中</p>
      </div>
      <div class="garden-art" aria-hidden="true"><div class="art-grid"></div><div class="art-sun"></div><div class="art-orbit"></div><div class="art-note"><span>THOUGHTS IN BLOOM</span><strong>今天的记录，<br>明天的回响。</strong><div class="note-lines"></div><small>保持好奇 · 慢慢生长</small></div><div class="art-label">一页一页，成为自己。 <span>✳</span></div></div>
    </section>
    <section id="topics" class="home-section">
      <div class="section-heading"><div><p class="eyebrow">EXPLORE BY TOPIC</p><h2>从感兴趣的地方开始</h2></div><a :href="withBase('/library')">全部主题 <span aria-hidden="true">↗</span></a></div>
      <div class="topic-grid"><a v-for="topic in topics" :key="topic.category" class="topic-card" :href="withBase('/library') + '?category=' + encodeURIComponent(topic.category)"><span class="topic-number">{{ topic.mark }} <span aria-hidden="true">↗</span></span><h3>{{ topic.name }}</h3><p>{{ topic.text }}</p><small>{{ notes.filter(p => p.category === topic.category).length }} 篇笔记</small></a></div>
    </section>
    <section class="home-section notes-section"><div class="section-heading"><div><p class="eyebrow">THE NOTEBOOK</p><h2>翻开一页笔记</h2></div><a :href="withBase('/library')">浏览全部 <span aria-hidden="true">↗</span></a></div><a v-for="(note, index) in featured" :key="note.url" class="home-note" :href="withBase(note.url)"><span class="note-index">0{{ index + 1 }}</span><h3>{{ note.title }}</h3><span class="note-category">{{ note.category }}</span><span aria-hidden="true">↗</span></a></section>
    <div class="garden-signoff">不急着抵达，先认真记录。<span>阳光笔记 / A GROWING COLLECTION</span></div>
  </main>
</template>
