<script setup>
/**
 * 文章管理页面
 * 展示文章列表，支持筛选、分页、编辑和删除操作
 */
import ChannelSelect from './components/ChannelSelect.vue'
import PageContainer from './components/PageContainer.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import {
  Edit,
  Delete,
  Search,
  Refresh,
  Document,
  CircleCheck,
  Timer
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'

// 文章列表数据
const articleList = ref([])
// 总条数（用于分页）
const total = ref(0)
// 加载状态
const loading = ref(false)

const publishedCount = computed(() => {
  return articleList.value.filter((item) => item.state === '已发布').length
})

const draftCount = computed(() => {
  return articleList.value.filter((item) => item.state === '草稿').length
})

// 查询参数（分类、状态、分页）
const params = ref({
  cate_id: '',
  state: '',
  pagenum: 1,
  pagesize: 10
})

// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

// 页面初始化时加载列表
getArticleList()

// 每页条数改变时重置页码
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}

// 当前页改变时加载对应页
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

// 搜索：重置页码到第一页
const onSearch = () => {
  loading.value = true
  params.value.pagenum = 1
  getArticleList()
}

// 重置：清空筛选条件，回到第一页
const onReset = () => {
  loading.value = true
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 文章编辑抽屉引用
const articleEditRef = ref()

// 新增文章：打开空抽屉
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑文章：传入行数据回显
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除文章：带确认框，处理分页边界
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  loading.value = true
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  // 删除后检查分页边界：当前页只剩一条且非第一页时，页码减一
  if (articleList.value.length === 1 && params.value.pagenum > 1) {
    params.value.pagenum--
  }
  await getArticleList()
}

// 子组件成功回调：新增跳最后一页，编辑刷新当前页
const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil(total.value / params.value.pagesize)
    params.value.pagenum = lastPage
    getArticleList()
  } else {
    getArticleList()
  }
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary" :icon="Plus">添加文章</el-button>
    </template>
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">
            <el-icon :size="24"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ total }}</div>
            <div class="stat-label">总文章数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-icon stat-icon-success">
            <el-icon :size="24"><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ publishedCount }}</div>
            <div class="stat-label">已发布</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-icon stat-icon-warning">
            <el-icon :size="24"><Timer /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ draftCount }}</div>
            <div class="stat-label">草稿</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索表单 -->
    <el-form inline class="search-form">
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.cate_id" style="width: 160px"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state" style="width: 140px" placeholder="全部状态">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary" :icon="Search">搜索</el-button>
        <el-button @click="onReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 文章列表：标题、分类、发表时间、状态、操作按钮、空数据提示 -->
    <el-table :data="articleList" v-loading="loading" class="article-table">
      <el-table-column label="文章标题" min-width="200">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" class="title-link">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name" width="120">
        <template #default="{ row }">
          <el-tag size="small" type="info">{{ row.cate_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发表时间" prop="pub_date" width="180">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" width="100">
        <template #default="{ row }">
          <el-tag :type="row.state === '已发布' ? 'success' : 'warning'" size="small">
            {{ row.state }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button
              :icon="Edit"
              class="action-btn action-edit"
              @click="onEditArticle(row)"
              title="编辑"
            ></el-button>
            <el-button
              :icon="Delete"
              class="action-btn action-delete"
              @click="onDeleteArticle(row)"
              title="删除"
            ></el-button>
          </div>
        </template>
      </el-table-column>
      <!-- 空数据提示 -->
      <template #empty>
        <el-empty description="暂无文章数据" />
      </template>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      class="pagination"
    />

    <!-- 文章编辑抽屉 -->
    <ArticleEdit @success="onSuccess" ref="articleEditRef"></ArticleEdit>
  </PageContainer>
</template>

<style lang="scss" scoped>
/* ===== 统计卡片样式 ===== */
.stats-row {
  margin-bottom: 20px;
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: linear-gradient(135deg, #fff, #f8fafc);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-light);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
      &.stat-icon-primary {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08));
        color: var(--primary-color);
      }
      &.stat-icon-success {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08));
        color: var(--success-color);
      }
      &.stat-icon-warning {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.08));
        color: var(--warning-color);
      }
    }
    .stat-info {
      flex: 1;
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1.2;
      }
      .stat-label {
        font-size: 13px;
        color: var(--text-secondary);
        margin-top: 4px;
      }
    }
  }
}

/* ===== 搜索表单样式 ===== */
.search-form {
  padding: 16px 20px;
  background-color: var(--bg-page);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}

/* ===== 文章表格样式 ===== */
.article-table {
  .title-link {
    font-weight: 500;
  }
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

/* ===== 分页样式 ===== */
.pagination {
  margin-top: 24px;
}
</style>
