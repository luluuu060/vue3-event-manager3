<script setup>
/**
 * 登录页面组件
 * 支持登录/注册模式切换，处理表单验证和用户认证流程
 */
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { watch, ref, onMounted } from 'vue'

// 加载状态与登录/注册模式切换
const loading = ref(false)
const isRegister = ref(true)

const formModel = ref({
  username: '',
  password: '',
  repassword: '',
  agree: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名长度必须在5-10之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{6,12}$/,
      message: '密码必须是6-12位字母或数字',
      trigger: 'blur'
    }
  ],
  repassword: [
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const form = ref()

// 注册表单提交
const register = async () => {
  if (!formModel.value.agree) {
    ElMessage.warning('请先阅读并同意《用户协议》和《隐私政策》')
    return
  }
  loading.value = true
  try {
    await form.value.validate()
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功')
    isRegister.value = false
  } catch (error) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

watch(isRegister, () => {
  formModel.value = { username: '', password: '', repassword: '', agree: false }
})

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 从 Vue2 前台跳转过来时，清除当前登录状态
onMounted(() => {
  if (route.query.from === 'vue2') {
    userStore.removeToken()
    userStore.setUser({})
    if (route.query.mode === 'register') {
      isRegister.value = true
    } else {
      isRegister.value = false
    }
  }
})

// 跳转到Vue2前台页面
const goToFrontend = () => {
  userStore.removeToken()
  userStore.setUser({})
  window.location.href = 'http://localhost:3000/#/login?from=vue3'
}

// 登录表单提交
const login = async () => {
  if (!formModel.value.agree) {
    ElMessage.warning('请先阅读并同意《用户协议》和《隐私政策》')
    return
  }
  loading.value = true
  try {
    await form.value.validate()
    const res = await userLoginService(formModel.value)
    userStore.setToken(res.data.token)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 登录页面主容器 -->
  <div class="login-page">
    <!-- 背景层：背景图 + 遮罩 -->
    <div class="bg-layer">
      <img src="@/assets/bg.png" alt="背景" class="bg-image" />
      <div class="bg-overlay"></div>
    </div>
    <!-- 内容容器：左右布局 -->
    <div class="main-container">
      <!-- 左侧：品牌展示区 -->
      <div class="left-section">
        <h2>Event Manager</h2>
        <p>一站式内容管理平台</p>
        <a class="frontend-link" @click="goToFrontend"> 前往前台浏览文章 → </a>
      </div>
      <!-- 右侧：登录/注册表单区 -->
      <div class="right-section">
        <div class="form-card" :class="{ 'login-mode': !isRegister }">
          <!-- 登录/注册切换标签 -->
          <div class="tab-switch">
            <div class="tab-item" :class="{ active: isRegister }" @click="isRegister = true">
              注册
            </div>
            <div class="tab-item" :class="{ active: !isRegister }" @click="isRegister = false">
              登录
            </div>
            <div class="tab-indicator" :class="{ login: !isRegister }"></div>
          </div>
          <!-- 注册表单 -->
          <el-form
            :model="formModel"
            :rules="rules"
            ref="form"
            size="large"
            autocomplete="off"
            v-if="isRegister"
          >
            <el-form-item prop="username">
              <el-input
                v-model="formModel.username"
                :prefix-icon="User"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="formModel.password"
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="repassword">
              <el-input
                v-model="formModel.repassword"
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入再次密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="formModel.agree"
                >我已阅读并同意《用户协议》和《隐私政策》</el-checkbox
              >
            </el-form-item>
            <el-form-item>
              <el-button @click="register" class="button" type="primary" :loading="loading"
                >注册</el-button
              >
            </el-form-item>
          </el-form>
          <!-- 登录表单 -->
          <el-form
            :model="formModel"
            :rules="rules"
            ref="form"
            size="large"
            autocomplete="off"
            v-else
          >
            <el-form-item prop="username">
              <el-input
                v-model="formModel.username"
                :prefix-icon="User"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="formModel.password"
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="formModel.agree"
                >我已阅读并同意《用户协议》和《隐私政策》</el-checkbox
              >
            </el-form-item>
            <el-form-item>
              <el-button @click="login" class="button" type="primary" :loading="loading"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ===== 一. 登录页面整体样式 ===== */
.login-page {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  /* 背景层：全屏背景图 + 暗色遮罩 */
  .bg-layer {
    position: absolute;
    inset: 0;
    .bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .bg-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(2px);
    }
  }

  /* 内容容器：居中布局，左右分栏 */
  .main-container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 60px;
    box-sizing: border-box;

    /* 左侧：品牌标题区域 */
    .left-section {
      flex: 1;
      color: #fff;
      padding-right: 60px;
      h2 {
        font-size: 72px;
        font-weight: 800;
        margin-bottom: 16px;
        text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        line-height: 1.1;
      }
      p {
        font-size: 28px;
        opacity: 0.9;
        letter-spacing: 4px;
        font-weight: 300;
      }
      .frontend-link {
        display: inline-block;
        cursor: pointer;
        margin-top: 32px;
        padding: 10px 24px;
        font-size: 15px;
        font-weight: 500;
        color: #fff;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        transition: all 0.3s;
        &:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
      }
    }

    /* 右侧：表单区域占位 */
    .right-section {
      flex-shrink: 0;
    }
  }
}

/* ===== 二. 登录/注册表单卡片 ===== */
.form-card {
  width: 380px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.5);

  /*1. 登录/注册切换标签 */
  .tab-switch {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
    .tab-item {
      width: 100px;
      height: 42px;
      line-height: 42px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: color 0.3s;
      &.active {
        color: #3b82f6;
      }
    }
    .tab-indicator {
      position: absolute;
      bottom: 0;
      left: calc(50% - 50px);
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      border-radius: 2px;
      transition: all 0.4s;
      &.login {
        left: calc(50% + 50px);
        background: linear-gradient(90deg, #6366f1, #4f46e5);
      }
    }
  }

  /*2. 提交按钮 */
  .button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 10px;
  }

  /* 3.表单项样式覆盖 */
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
  :deep(.el-form-item__content) {
    width: 100%;
    margin-left: 0 !important;
  }
  :deep(.el-input__wrapper) {
    width: 100%;
    height: 46px;
    border-radius: 10px;
    box-shadow: none;
    &:hover {
      box-shadow: 0 2px 12px rgba(59, 130, 246, 0.1);
    }
    &.is-focus {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      border-color: #3b82f6;
    }
  }
  :deep(.el-input__inner) {
    height: 46px;
    font-size: 15px;
  }
  :deep(.el-checkbox__label) {
    font-size: 14px;
    color: #64748b;
  }
}

/* ===== 三. 登录模式样式覆盖 ===== */
.login-mode {
  .tab-item.active {
    color: #6366f1;
  }
  .button {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none;
    &:hover {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
    }
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    border-color: #6366f1;
  }
  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.1);
  }
}
</style>
