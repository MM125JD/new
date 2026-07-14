<!-- .vitepress/theme/components/GiscusComment.vue -->
<template>
  <div class="giscus-comment-container">
    <!-- Giscus 评论组件渲染的宿主元素 -->
    <component 
      :is="'script'"
      src="https://giscus.app/client.js"
      data-repo="MM125JD/new"
      data-repo-id="R_kgDOTRXwDw"
      data-category="General"
      data-category-id="DIC_kwDOTRXwD84DBJb8"
      data-mapping="pathname"
      data-strict="0"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="bottom"
      data-theme="preferred_color_scheme"
      data-lang="zh-CN"
      crossorigin="anonymous"
      async
    />
  </div>
</template>

<style scoped>
/* 给评论区加一点顶部的间距，让它和你的正文内容隔开，排版更美观 */
.giscus-comment-container {
  margin-top: 40px;
  border-top: 1px dashed var(--vp-c-divider);
  padding-top: 24px;
}
</style>