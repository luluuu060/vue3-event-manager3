<script setup>
/**
 * 页面容器组件
 * 提供统一的页面头部布局，包含标题和右侧操作区
 */
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <!-- 页面容器：卡片式布局 -->
  <el-card class="page-container">
    <!-- 头部区域：左侧标题 + 右侧操作按钮 -->
    <template #header>
      <div class="card-header">
        <div class="header-left">
          <div class="header-icon"></div>
          <span class="header-title">{{ title }}</span>
        </div>
        <div class="header-right">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 内容区域：默认插槽 -->
    <div class="card-body">
      <slot></slot>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
/* ===== 页面容器整体样式 ===== */
.page-container {
  min-height: 100%;

  /* ===== 卡片头部 ===== */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    /* ===== 头部左侧 ===== */
    .header-left {
      display: flex;
      align-items: center;

      /* ===== 标题图标 ===== */
      .header-icon {
        width: 4px;
        height: 20px;
        background: linear-gradient(180deg, var(--primary-color), var(--primary-light));
        border-radius: 2px;
        margin-right: 12px;
      }

      /* ===== 标题文字 ===== */
      .header-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
      }
    }

    /* ===== 头部右侧 ===== */
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  /* ===== 卡片内容区 ===== */
  .card-body {
    padding: 24px;
  }
}
</style>
