<script setup>
/**
 * 文章编辑组件
 * 支持文章新增和编辑，包含标题、分类、封面、富文本内容等字段
 */
import ChannelSelect from './ChannelSelect.vue'
import { ref, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import { artPublishService, artGetDetailService, artEditService } from '@/api/article'
import { apiBaseURL } from '@/utils/request'
import axios from 'axios'

// 表单校验规则
const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  cover_img: [{ required: true, message: '请上传文章封面', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

// 抽屉显示状态
const visibleDrawer = ref(false)
const loading = ref(false)
const isEdit = ref(false)

// 默认表单数据（用于重置）
const defaultData = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
})

// 当前表单数据（展开拷贝避免引用污染）
const formModel = ref({ ...defaultData.value })
// 封面预览地址
const imgUrl = ref('')
// 富文本编辑器引用
const editorRef = ref()

// 文件选择回调：更新预览和表单文件
const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

// 定义成功事件，通知父组件刷新
const emit = defineEmits(['success'])

// 提交文章（发布/草稿共用）
const onPublish = async (state) => {
  // 同步编辑器内容到表单
  if (editorRef.value) {
    formModel.value.content = editorRef.value.getHTML()
  }
  // 设置发布状态
  formModel.value.state = state

  // 构建FormData（含文件需用FormData）
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  loading.value = true
  try {
    if (formModel.value.id) {
      // 编辑模式
      await artEditService(fd)
      ElMessage.success('编辑成功')
      visibleDrawer.value = false
      emit('success', 'edit')
    } else {
      // 新增模式
      await artPublishService(fd)
      ElMessage.success('添加成功')
      visibleDrawer.value = false
      emit('success', 'add')
    }
  } catch (error) {
    console.error('文章提交失败:', error)
  } finally {
    loading.value = false
  }
}

// 网络图片转File对象（编辑回显时使用）
const imageUrlToFile = async (url, fileName) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  const imageData = response.data
  const blob = new Blob([imageData], { type: response.headers['content-type'] })
  return new File([blob], fileName, { type: blob.type })
}

// 打开抽屉（编辑时传入行数据，新增时传入空对象）
const open = async (row) => {
  isEdit.value = !!row.id
  visibleDrawer.value = true
  if (row.id) {
    loading.value = true
    imgUrl.value = ''
    await nextTick()
    try {
      const res = await artGetDetailService(row.id)
      formModel.value = res.data.data
      imgUrl.value = apiBaseURL + formModel.value.cover_img
      formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
      await nextTick()
      if (editorRef.value && formModel.value.content) {
        editorRef.value.setHTML(formModel.value.content)
      }
    } finally {
      loading.value = false
    }
  } else {
    formModel.value = { ...defaultData.value }
    imgUrl.value = ''
    await nextTick()
    if (editorRef.value) {
      editorRef.value.setHTML('')
    }
  }
}

// 暴露open方法供父组件调用
defineExpose({ open })
</script>

<template>
  <!-- 文章添加/编辑抽屉：从右侧滑出 -->
  <el-drawer
    v-model="visibleDrawer"
    :title="isEdit ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="60%"
    :close-on-click-modal="false"
    append-to-body
    modal-append-to-body
  >
    <!-- 文章表单 -->
    <el-form
      v-loading="loading"
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="article-form"
    >
      <!-- 1. 文章标题 -->
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入文章标题" size="large"></el-input>
      </el-form-item>
      <!-- 2. 文章分类 -->
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
          placeholder="请选择文章分类"
        ></channel-select>
      </el-form-item>
      <!-- 3. 文章封面 -->
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="cover-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onSelectFile"
        >
          <div v-if="imgUrl" class="cover-preview">
            <img :src="imgUrl" class="cover-img" />
            <div class="cover-overlay">
              <el-icon class="cover-icon"><Plus /></el-icon>
            </div>
          </div>
          <div v-else class="cover-placeholder">
            <el-icon class="cover-icon"><Plus /></el-icon>
            <span class="cover-text">点击上传封面</span>
          </div>
        </el-upload>
      </el-form-item>
      <!-- 4. 文章内容 -->
      <el-form-item label="文章内容" prop="content">
        <div class="editor-wrapper">
          <quill-editor
            v-model="formModel.content"
            ref="editorRef"
            content-type="html"
            theme="snow"
          ></quill-editor>
        </div>
      </el-form-item>
      <!-- 5. 操作按钮组 -->
      <el-form-item class="form-actions">
        <el-button @click="onPublish('已发布')" type="primary" :loading="loading"
          >发布文章</el-button
        >
        <el-button @click="onPublish('草稿')" type="info" :loading="loading">保存草稿</el-button>
        <el-button @click="visibleDrawer = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
/* ===== 文章表单样式 ===== */
.article-form {
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border-light);
    margin-top: 20px;
    padding-left: 100px;
  }
}

/* ===== 文章内容编辑器样式 ===== */
.editor-wrapper {
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  :deep(.ql-toolbar) {
    background-color: var(--border-light);
    border-bottom: 1px solid var(--border-color);
    padding: 10px 16px;
  }
  :deep(.ql-editor) {
    min-height: 300px;
    padding: 20px;
  }
  :deep(.ql-container) {
    font-size: 15px;
  }
}

/* ===== 文章封面预览样式 ===== */
.cover-preview {
  position: relative;
  width: 200px;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--border-color);
  transition: all var(--transition-normal);
  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  .cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cover-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    .cover-icon {
      color: #fff;
      font-size: 32px;
    }
  }
  &:hover .cover-overlay {
    opacity: 1;
  }
}

/* ===== 文章封面上传占位符样式 ===== */
.cover-placeholder {
  width: 200px;
  height: 150px;
  border: 2px dashed var(--primary-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: rgba(59, 130, 246, 0.05);
  .cover-icon {
    font-size: 40px;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  .cover-text {
    font-size: 14px;
    color: var(--text-regular);
    font-weight: 500;
  }
  &:hover {
    border-style: solid;
    background-color: rgba(59, 130, 246, 0.1);
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  }
}

/* ===== 文章封面上传组件样式 ===== */
.cover-uploader {
  :deep(.el-upload) {
    border: none;
    padding: 0;
  }
}
</style>
