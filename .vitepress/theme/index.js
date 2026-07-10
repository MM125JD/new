import DefaultTheme from 'vitepress/theme'
import './custom.css'

// 必须导出为一个包含 Layout 和 enhanceApp 的对象，或者使用这种标准结构
export default {
  ...DefaultTheme, // 继承官方默认主题的所有布局和组件
  
  enhanceApp({ app, router, siteData }) {
    // 可以在这里注册全局组件或做其他扩展
  }
}