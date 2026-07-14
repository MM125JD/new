---
aside: false
---

<script setup>
import PostList from '@theme/components/PostList.vue'
import Features from '@theme/components/Features.vue'


const myFeatures = [
  { 
    title: '基础语法', 
    details: '快速复习 Kotlin 基础语法，掌握类、函数、以及控制流。',
    link: '/posts/你好/Kotlin基础复习.html' // 👈 内部链接，会自动拼接 /new/ 并在当前页打开
  },
  { 
    title: 'Kotlin 官网', 
    details: '访问 Kotlin 官方网站获取最新资讯与高级指南。',
    link: 'https://kotlinlang.org' // 👈 外部链接，会自动在新窗口打开
  },
    { 
    title: '基础语法', 
    details: '快速复习 Kotlin 基础语法，掌握类、函数、以及控制流。',
    link: '/posts/你好/Kotlin基础复习.html' // 👈 内部链接，会自动拼接 /new/ 并在当前页打开
  },
    { 
    title: '基础语法', 
    details: '快速复习 Kotlin 基础语法，掌握类、函数、以及控制流。',
    link: '/posts/你好/Kotlin基础复习.html' // 👈 内部链接，会自动拼接 /new/ 并在当前页打开
  },
    { 
    title: '基础语法', 
    details: '快速复习 Kotlin 基础语法，掌握类、函数、以及控制流。',
    link: '/posts/你好/Kotlin基础复习.html' // 👈 内部链接，会自动拼接 /new/ 并在当前页打开
  }
]
</script>

# 我的普通文档页面

<Features :items="myFeatures" />
<!-- 如果下面还需要渲染文章列表，直接放组件即可 --> <PostList />