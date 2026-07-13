<script setup>
/**
 * 用户基本资料页面
 * 展示和修改用户昵称、邮箱等信息
 */
import PageContainer from '@/views/article/components/PageContainer.vue'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { updateUserInfoService } from '@/api/user'

const loading = ref(false)

// 从store解构用户信息和更新方法
const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()

// 表单数据（基于store数据初始化）
const userInfo = ref({ username, nickname, email, id })

// 表单校验规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const formRef = ref()

// 提交表单：更新用户信息
const submitForm = async () => {
  loading.value = true
  try {
    await formRef.value.validate()
    await updateUserInfoService(userInfo.value)
    // 更新store数据，保持状态同步
    getUser()
    ElMessage.success('修改成功')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <page-container title="基本资料">
    <el-row v-loading="loading" justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <!-- 用户个人信息卡片 -->
        <div class="profile-card">
          <!-- 用户个人信息卡片标题 -->
          <div class="card-header">
            <el-icon class="card-icon"><User /></el-icon>
            <span class="card-title">个人信息</span>
          </div>
          <!-- 用户个人信息表单 -->
          <el-form
            :model="userInfo"
            :rules="rules"
            ref="formRef"
            label-width="120px"
            size="large"
            class="user-form"
          >
            <el-form-item label="登录名称">
              <el-input v-model="userInfo.username" disabled class="disabled-input"></el-input>
              <div class="form-tip">登录名称无法修改</div>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
              <el-input
                v-model="userInfo.nickname"
                placeholder="请输入昵称（2-10位字符）"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="userInfo.email" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
            <el-form-item class="form-actions">
              <el-button @click="submitForm" type="primary" :loading="loading">提交修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
/* ===== 用户个人信息卡片样式 ===== */
.profile-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
  .card-header {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.04));
    border-bottom: 1px solid var(--border-light);
    .card-icon {
      font-size: 20px;
      color: var(--primary-color);
      margin-right: 10px;
    }
    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

/* ===== 用户个人信息表单样式 ===== */
.user-form {
  padding: 24px;
  :deep(.el-form-item__content) {
    margin-left: 20px !important;
  }
  .disabled-input {
    background-color: var(--border-light);
    color: var(--text-secondary);
  }
  .form-tip {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 8px;
  }
  .form-actions {
    padding-top: 20px;
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}

/* ===== 响应式：小屏幕下减小内边距和标签宽度 ===== */
@media screen and (max-width: 768px) {
  .profile-card .card-header {
    padding: 12px 16px;
  }
  .user-form {
    padding: 16px;
    :deep(.el-form-item__label) {
      width: 80px !important;
    }
    .form-actions {
      padding-top: 12px;
    }
  }
}
</style>
