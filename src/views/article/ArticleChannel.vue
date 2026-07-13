<script setup>
/**
 * 文章分类管理页面
 * 展示分类列表，支持新增、编辑和删除操作
 */
import { Edit, Delete, Plus, FolderOpened } from '@element-plus/icons-vue'
import PageContainer from './components/PageContainer.vue'
import { artGetChannelService, artDeleteChannelService } from '@/api/article'
import { ref } from 'vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessageBox } from 'element-plus'

// 分类列表数据
const channelList = ref([])
const loading = ref(true)

// 获取分类列表
const getChannelList = async () => {
  const res = await artGetChannelService()
  channelList.value = res.data.data
  loading.value = false
}

// 页面初始化加载
getChannelList()

// 删除分类：带确认框
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  loading.value = true
  try {
    await artDeleteChannelService(row.id)
    getChannelList()
    ElMessage.success('删除成功')
  } finally {
    loading.value = false
  }
}

// 弹窗引用
const dialog = ref()

// 编辑分类：传入行数据
const onEditChannel = (row) => {
  dialog.value.open(row)
}

// 新增分类：传入空对象
const onAddChannel = () => {
  dialog.value.open({})
}

// 子组件成功回调：刷新列表
const onSuccess = async () => {
  loading.value = true
  try {
    await getChannelList()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 文章分类管理页面 -->
  <PageContainer title="文章分类">
    <!-- 右侧操作区：添加分类按钮 -->
    <template #extra>
      <el-button type="primary" @click="onAddChannel" :icon="Plus">添加分类</el-button>
    </template>
    <!-- 分类列表 -->
    <el-table v-loading="loading" :data="channelList" class="channel-table">
      <el-table-column type="index" label="ID" width="80" />
      <el-table-column prop="cate_name" label="分类名称" min-width="200">
        <template #default="{ row }">
          <div class="category-name">
            <el-icon class="name-icon"><FolderOpened /></el-icon>
            <span>{{ row.cate_name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cate_alias" label="分类别名" width="180">
        <template #default="{ row }">
          <code class="alias-code">{{ row.cate_alias }}</code>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button
              :icon="Edit"
              class="action-btn action-edit"
              @click="onEditChannel(row)"
              title="编辑"
            ></el-button>
            <el-button
              :icon="Delete"
              class="action-btn action-delete"
              @click="onDelChannel(row)"
              title="删除"
            ></el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无分类数据" />
      </template>
    </el-table>
    <!-- 分类编辑弹窗 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </PageContainer>
</template>

<style lang="scss" scoped>
/* ===== 分类表格样式 ===== */
.channel-table {
  /* ===== 分类名称 ===== */
  .category-name {
    display: flex;
    align-items: center;
    .name-icon {
      color: var(--primary-color);
      margin-right: 8px;
      font-size: 16px;
    }
    span {
      font-weight: 500;
    }
  }

  /* ===== 分类别名 ===== */
  .alias-code {
    background-color: var(--border-light);
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 13px;
    color: var(--text-regular);
    font-family: monospace;
  }

  /* ===== 操作按钮 ===== */
  .action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .action-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    border: 1.5px solid transparent;
    &.action-edit {
      background-color: rgba(59, 130, 246, 0.1);
      color: var(--primary-color);
      border-color: rgba(59, 130, 246, 0.2);
      &:hover {
        background-color: var(--primary-color);
        color: #fff;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
    }
    &.action-delete {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--danger-color);
      border-color: rgba(239, 68, 68, 0.2);
      &:hover {
        background-color: var(--danger-color);
        color: #fff;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      }
    }
  }
}
</style>
