<script setup>
/**
 * 用户密码修改页面
 * 支持验证原密码、设置新密码，成功后强制重新登录
 */
import { userUpdatePassService } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import PageContainer from '@/views/article/components/PageContainer.vue'
import { ref } from 'vue'
import { Refresh, Lock } from '@element-plus/icons-vue'

const loading = ref(false)

// 密码表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 校验：新密码不能与原密码相同
const checkDifferent = (rule, value, cb) => {
  if (value === pwdForm.value.old_pwd) {
    cb(new Error('原密码和新密码不能一样!'))
  } else {
    cb()
  }
}

// 校验：确认密码与新密码一致
const checkSameAsNew = (rule, value, cb) => {
  if (value !== pwdForm.value.new_pwd) {
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}

// 表单校验规则
const rules = {
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkSameAsNew, trigger: 'blur' }
  ]
}

const formRef = ref()
const router = useRouter()
const userStore = useUserStore()

// 提交修改密码：成功后清空token并跳转登录页
const onSubmit = async () => {
  loading.value = true
  try {
    await formRef.value.validate()
    await userUpdatePassService(pwdForm.value)
    ElMessage({ type: 'success', message: '更换密码成功' })
    // 清空用户状态
    userStore.setToken('')
    userStore.setUser({})
    // 跳转到登录页重新登录
    router.push('/login')
  } finally {
    loading.value = false
  }
}

// 重置表单
const onReset = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="重置密码">
    <el-row v-loading="loading" justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <div class="password-card">
          <div class="card-header">
            <el-icon class="card-icon"><Lock /></el-icon>
            <span class="card-title">修改密码</span>
          </div>
          <el-form
            :model="pwdForm"
            :rules="rules"
            ref="formRef"
            label-width="120px"
            size="large"
            class="password-form"
          >
            <el-form-item label="原密码" prop="old_pwd">
              <el-input
                v-model="pwdForm.old_pwd"
                type="password"
                placeholder="请输入当前密码"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_pwd">
              <el-input
                v-model="pwdForm.new_pwd"
                type="password"
                placeholder="请输入新密码（6-15位非空字符）"
                show-password
              ></el-input>
              <div class="form-tip">密码长度必须是6-15位的非空字符串</div>
            </el-form-item>
            <el-form-item label="确认新密码" prop="re_pwd">
              <el-input
                v-model="pwdForm.re_pwd"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item class="form-actions">
              <el-button @click="onReset" :icon="Refresh">重置</el-button>
              <el-button @click="onSubmit" type="primary" :loading="loading">修改密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
/* ===== 密码卡片样式 ===== */
.password-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
  .card-header {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.04));
    border-bottom: 1px solid var(--border-light);
    .card-icon {
      font-size: 20px;
      color: var(--danger-color);
      margin-right: 10px;
    }
    .card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }
  }
}

/* ===== 密码表单样式 ===== */
.password-form {
  padding: 24px;
  :deep(.el-form-item__content) {
    margin-left: 20px !important;
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
  .password-card .card-header {
    padding: 12px 16px;
  }
  .password-form {
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
