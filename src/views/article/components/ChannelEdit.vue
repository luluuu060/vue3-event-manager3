<script setup>
/**
 * 分类编辑弹窗组件
 * 支持分类新增和编辑，包含名称和别名两个字段
 */
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ref } from 'vue'

const loading = ref(false)

// 表单数据模型
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})

// 表单校验规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

// 弹窗显示状态
const dialogVisible = ref(false)

// 打开弹窗（编辑时传入行数据回显，新增时传入空对象）
const open = (row) => {
  dialogVisible.value = true
  // 展开运算符拷贝对象，避免直接引用导致数据污染
  formModel.value = { ...row }
}

// 暴露open方法供父组件调用
defineExpose({ open })

const formRef = ref()
// 定义成功事件，通知父组件刷新列表
const emit = defineEmits(['success'])

// 提交表单（新增/编辑共用）
const onSubmit = async () => {
  loading.value = true
  try {
    // 先校验表单
    await formRef.value.validate()
    // 根据是否有id判断新增还是编辑
    const isEdit = formModel.value.id
    if (isEdit) {
      await artEditChannelService(formModel.value)
      ElMessage.success('编辑成功')
    } else {
      await artAddChannelService(formModel.value)
      ElMessage.success('添加成功')
    }
    // 通知父组件刷新
    emit('success')
    // 关闭弹窗
    dialogVisible.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 分类编辑弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="480px"
    :close-on-click-modal="false"
    append-to-body
    lock-scroll
    modal-append-to-body
    class="channel-edit-dialog"
  >
    <div v-loading="loading">
      <!-- 分类表单：名称 + 别名 -->
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-width="100px"
        class="channel-form"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            v-model="formModel.cate_name"
            placeholder="请输入分类名称（1-10位字符）"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            v-model="formModel.cate_alias"
            placeholder="请输入分类别名（1-15位字母数字）"
            size="large"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部按钮区 -->
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">确认</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">
/* ===== 弹窗样式 ===== */
.channel-edit-dialog {
  .el-form-item {
    margin-bottom: 5px;
  }
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .el-form-item__content {
    margin-left: 20px !important;
    margin-bottom: 20px;
  }
}
</style>
