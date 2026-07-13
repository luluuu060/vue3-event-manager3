<script setup>
/**
 * 布局容器组件
 * 包含侧边栏、顶部导航、面包屑、用户下拉菜单和AI助手入口
 */
import {
  FolderOpened,
  Document,
  UserFilled,
  User,
  Camera,
  Key,
  SwitchButton,
  CaretBottom,
  Menu,
  Fold
} from '@element-plus/icons-vue'
import AIAssistant from '@/components/AIAssistant.vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue'

// 初始化用户信息
const userStore = useUserStore()
userStore.getUser()

const router = useRouter()
const route = useRoute()

// 侧边栏折叠状态
const isCollapsed = ref(false)
const toggleMenu = () => {
  isCollapsed.value = !isCollapsed.value
}

// 根据当前路由生成面包屑导航
const breadcrumbItems = computed(() => {
  const path = route.path
  const items = [{ name: '首页', path: '/' }]

  if (path.startsWith('/article/')) {
    items.push({ name: '文章管理', path: '/article' })
    if (path === '/article/channel') {
      items.push({ name: '文章分类', path: '/article/channel' })
    } else if (path === '/article/manage') {
      items.push({ name: '文章列表', path: '/article/manage' })
    }
  } else if (path.startsWith('/user/')) {
    items.push({ name: '个人中心', path: '/user' })
    if (path === '/user/profile') {
      items.push({ name: '基本资料', path: '/user/profile' })
    } else if (path === '/user/avatar') {
      items.push({ name: '更换头像', path: '/user/avatar' })
    } else if (path === '/user/password') {
      items.push({ name: '重置密码', path: '/user/password' })
    }
  }

  return items
})

// 用户下拉菜单命令处理（退出登录/个人中心跳转）
const handleCommand = async (key) => {
  if (key === 'logout') {
    await ElMessageBox.confirm('是否确定退出登录？', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <!-- 整体布局容器 -->
  <el-container class="layout-container">
    <!-- 侧边栏：可折叠 -->
    <el-aside :width="isCollapsed ? '64px' : '200px'" :class="{ collapsed: isCollapsed }">
      <!-- Logo区域 -->
      <div class="aside-logo">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo-img" />
        <span v-if="!isCollapsed" class="logo-text">Event Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        active-text-color="#93c5fd"
        background-color="transparent"
        :default-active="$route.path"
        text-color="#cbd5e1"
        router
        :collapse="isCollapsed"
        class="aside-menu"
      >
        <el-menu-item index="/article/channel">
          <el-icon class="menu-icon"><FolderOpened /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon class="menu-icon"><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon class="menu-icon"><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Camera /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><Key /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 主内容区域 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="main-header">
        <div class="header-left">
          <!-- 菜单折叠按钮 -->
          <div @click="toggleMenu" class="menu-toggle">
            <el-icon><Menu v-if="isCollapsed" /><Fold v-else /></el-icon>
            <span class="toggle-text">{{ isCollapsed ? '展开' : '收起' }}</span>
          </div>
          <!-- 面包屑导航 -->
          <div class="header-breadcrumb">
            <template v-for="(item, index) in breadcrumbItems" :key="index">
              <span
                :class="{
                  'breadcrumb-active': index === breadcrumbItems.length - 1
                }"
              >
                {{ item.name }}
              </span>
              <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator">/</span>
            </template>
          </div>
        </div>
        <div class="header-right">
          <!-- 用户信息显示 -->
          <div class="user-info">
            <span class="user-label">欢迎,</span>
            <span class="user-name">{{ userStore.user.nickname || userStore.user.username }}</span>
          </div>
          <!-- 用户下拉菜单 -->
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="dropdown-trigger">
              <el-avatar :src="userStore.user.user_pic || avatar" class="user-avatar" />
              <el-icon class="caret-icon"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Camera">更换头像</el-dropdown-item>
                <el-dropdown-item command="password" :icon="Key">重置密码</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view></router-view>
      </el-main>
      <el-footer class="main-footer">大事件 ©2026 Created by lulu</el-footer>
    </el-container>
    <AIAssistant />
  </el-container>
</template>

<style lang="scss" scoped>
/* ===== 布局容器整体样式 ===== */
.layout-container {
  height: 100vh;
  background-color: var(--bg-page);

  /* ===== 侧边栏样式 ===== */
  .el-aside {
    background: linear-gradient(180deg, #1e3a5f, #0f172a);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
    transition: width 0.3s ease;
    overflow: hidden;
    &.collapsed .aside-logo .logo-text {
      opacity: 0;
      pointer-events: none;
    }

    /* ===== Logo区域 ===== */
    .aside-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 16px;
      border-bottom: 1px solid rgba(96, 165, 250, 0.1);
      .logo-img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border-radius: var(--radius-md);
        flex-shrink: 0;
      }
      .logo-text {
        font-size: 18px;
        font-weight: 700;
        color: #93c5fd;
        white-space: nowrap;
        transition: opacity 0.3s ease;
      }
    }

    /* ===== 导航菜单 ===== */
    .aside-menu {
      border-right: none;
      background-color: transparent;
      .el-menu-item,
      .el-sub-menu__title {
        height: 52px;
        line-height: 52px;
        padding: 0 12px !important;
        &:hover {
          background-color: rgba(96, 165, 250, 0.1) !important;
          transform: translateX(4px);
        }
      }
      .el-menu-item.is-active {
        background-color: rgba(96, 165, 250, 0.15) !important;
        .menu-icon {
          color: #93c5fd;
        }
      }
      .menu-icon {
        font-size: 20px;
        margin-right: 10px;
        transition: color 0.3s ease;
        color: #64748b;
      }
      /* ===== 二级菜单 ===== */
      .el-sub-menu .el-menu-item {
        height: 48px;
        line-height: 48px;
        padding-left: 40px !important;
        background-color: rgba(0, 0, 0, 0.15) !important;
        &:hover {
          background-color: rgba(96, 165, 250, 0.1) !important;
        }
      }
    }
  }

  /* ===== 主内容容器 ===== */
  .main-container {
    /* ===== 顶部导航栏 ===== */
    .main-header {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 60px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      /* ===== 左侧区域 ===== */
      .header-left {
        display: flex;
        align-items: center;

        /* ===== 菜单折叠按钮 ===== */
        .menu-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 24px;
          color: var(--text-regular);
          cursor: pointer;
          margin-right: 20px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          background-color: var(--border-light);
          border: 1px solid var(--border-color);
          .toggle-text {
            font-size: 13px;
            font-weight: 500;
          }
          &:hover {
            background-color: rgba(59, 130, 246, 0.1);
            color: var(--primary-color);
            border-color: var(--primary-color);
          }
        }

        /* ===== 面包屑导航 ===== */
        .header-breadcrumb {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: var(--text-secondary);
          background-color: var(--bg-page);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          height: 36px;
          span:not(.breadcrumb-separator) {
            color: var(--text-regular);
          }
          span.breadcrumb-active {
            color: var(--primary-color);
            font-weight: 600;
            background-color: rgba(59, 130, 246, 0.1);
            padding: 2px 8px;
            border-radius: 4px;
            margin: 0 4px;
          }
          .breadcrumb-separator {
            margin: 0 8px;
            font-weight: bold;
          }
        }
      }

      /* ===== 右侧区域 ===== */
      .header-right {
        display: flex;
        align-items: center;
        flex-shrink: 0;

        /* ===== 用户信息 ===== */
        .user-info {
          margin-right: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          .user-label {
            font-size: 14px;
            color: var(--text-secondary);
          }
          .user-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }
        }
        .dropdown-trigger {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-md);
          transition: background-color 0.2s ease;
          &:hover {
            background-color: var(--border-light);
          }
        }
        .user-avatar {
          width: 36px;
          height: 36px;
        }
        .caret-icon {
          color: var(--text-secondary);
          margin-left: 6px;
          font-size: 14px;
        }
      }
    }

    .main-content {
      padding: 20px;
      background-color: var(--bg-page);
      overflow: auto;
    }
    .main-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: var(--text-secondary);
      background-color: #fff;
      border-top: 1px solid var(--border-color);
      padding: 12px 0;
    }
  }
}
</style>
