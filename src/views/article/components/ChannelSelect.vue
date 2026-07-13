<script setup>
/**
 * 文章分类选择组件
 * 封装分类下拉选择器，自动加载分类列表
 */
import { artGetChannelService } from '@/api/article'
import { ref, defineProps } from 'vue'
import { defineModel } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  }
})

const modelValue = defineModel()

const channelList = ref([])

const getChannelList = async () => {
  const res = await artGetChannelService()
  channelList.value = res.data.data
}

getChannelList()
</script>

<template>
  <!-- 分类下拉选择器 -->
  <el-select v-model="modelValue" :style="{ width: props.width }" teleported>
    <!-- 分类选项列表 -->
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
