<script setup>
/**
 * 应用根组件
 * 配置Element Plus国际化（中文），作为路由视图出口
 */
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <!-- Element Plus全局配置：中文语言 -->
  <el-config-provider :locale="zhCn">
    <!-- 路由视图出口 -->
    <router-view />
  </el-config-provider>
</template>
