<script setup>
/**
 * 用户头像设置页面
 * 支持头像预览、上传和更新
 */
import { ref } from 'vue'
import { Plus, Upload, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUploadAvatarService } from '@/api/user'
import PageContainer from '@/views/article/components/PageContainer.vue'

const userStore = useUserStore()
// 当前头像地址（从store初始化）
const imgUrl = ref(userStore.user.user_pic)
// 上传组件引用
const uploadRef = ref()
const loading = ref(false)

// 文件选择回调：读取文件并预览
const onSelectFile = async (uploadFile) => {
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}

// 上传头像：调用接口并更新store
const onUpdateAvatar = async () => {
  loading.value = true
  try {
    await userUploadAvatarService(imgUrl.value)
    // 更新store中的用户信息
    await userStore.getUser()
    ElMessage({ type: 'success', message: '更换头像成功' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 用户头像设置页面 -->
  <page-container title="更换头像">
    <el-row v-loading="loading" justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
        <div class="avatar-card">
          <!-- 头像卡片标题 -->
          <div class="card-header">
            <el-icon class="card-icon"><User /></el-icon>
            <span class="card-title">头像设置</span>
          </div>
          <!-- 头像上传区域 -->
          <div class="avatar-section">
            <el-upload
              ref="uploadRef"
              class="avatar-uploader"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onSelectFile"
            >
              <div class="avatar-wrapper">
                <img v-if="imgUrl" :src="imgUrl" class="avatar-img" />
                <img v-else src="@/assets/avatar.jpg" class="avatar-img" />
                <div class="avatar-overlay">
                  <el-icon class="overlay-icon"><Plus /></el-icon>
                  <span class="overlay-text">更换头像</span>
                </div>
              </div>
            </el-upload>
            <div class="avatar-tip">支持 JPG、PNG 格式，建议尺寸 200x200</div>
          </div>
          <!-- 头像操作按钮区 -->
          <div class="avatar-actions">
            <el-button
              @click="uploadRef.$el.querySelector('input').click()"
              type="primary"
              :icon="Plus"
              size="large"
            >
              选择图片
            </el-button>
            <el-button
              @click="onUpdateAvatar"
              type="success"
              :icon="Upload"
              size="large"
              :loading="loading"
            >
              上传头像
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
/* ===== 用户头像设置卡片样式 ===== */
.avatar-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
  padding: 24px;
  .card-header {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
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

/* ===== 头像上传区域样式 ===== */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar-wrapper {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 4px solid var(--primary-color);
    box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(64, 158, 255, 0.4);
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .avatar-overlay {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      .overlay-icon {
        font-size: 32px;
        color: #fff;
        margin-bottom: 8px;
      }
      .overlay-text {
        font-size: 13px;
        color: #fff;
      }
    }
    &:hover .avatar-overlay {
      opacity: 1;
    }
  }
  .avatar-tip {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 16px;
  }
}

/* ===== 头像操作按钮区样式 ===== */
.avatar-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}

/* ===== 响应式：小屏幕下头像缩小、按钮纵向排列 ===== */
@media screen and (max-width: 768px) {
  .avatar-card {
    padding: 16px;
  }
  .avatar-card .card-header {
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
  .avatar-section .avatar-wrapper {
    width: 160px;
    height: 160px;
  }
  .avatar-actions {
    margin-top: 20px;
    flex-direction: column;
    align-items: stretch;
    .el-button {
      width: 100%;
    }
  }
}
</style>
