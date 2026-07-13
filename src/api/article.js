/**
 * @file article.js
 * @description 文章模块 API 接口封装
 * @description 包含文章分类管理和文章管理相关接口
 */

import request from '@/utils/request'

// ========== 文章分类接口 ==========

/**
 * 获取文章分类列表
 * @returns {Promise} - 请求 Promise
 */
export const artGetChannelService = () => request.get('/my/cate/list')

/**
 * 添加文章分类
 * @param {Object} data - 分类信息
 * @param {string} data.cate_name - 分类名称
 * @param {string} data.cate_alias - 分类别名
 * @returns {Promise} - 请求 Promise
 */
export const artAddChannelService = (data) => request.post('/my/cate/add', data)

/**
 * 编辑文章分类
 * @param {Object} data - 分类信息
 * @param {number} data.id - 分类ID
 * @param {string} data.cate_name - 分类名称
 * @param {string} data.cate_alias - 分类别名
 * @returns {Promise} - 请求 Promise
 */
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)

/**
 * 删除文章分类
 * @param {number} id - 分类ID
 * @returns {Promise} - 请求 Promise
 */
export const artDeleteChannelService = (id) =>
  request.delete('/my/cate/del', { params: { id } })

// ========== 文章管理接口 ==========

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.cate_id - 分类ID（可选）
 * @param {string} params.state - 发布状态（可选）
 * @param {number} params.pagenum - 当前页码
 * @param {number} params.pagesize - 每页条数
 * @returns {Promise} - 请求 Promise
 */
export const artGetListService = (params) =>
  request.get('/my/article/list', { params })

/**
 * 添加文章
 * @param {FormData} data - 文章表单数据（含文件）
 * @returns {Promise} - 请求 Promise
 */
export const artPublishService = (data) => request.post('/my/article/add', data)

/**
 * 获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise} - 请求 Promise
 */
export const artGetDetailService = (id) =>
  request.get('/my/article/info', { params: { id } })

/**
 * 编辑文章
 * @param {FormData} data - 文章表单数据（含文件）
 * @returns {Promise} - 请求 Promise
 */
export const artEditService = (data) => request.put('/my/article/info', data)

/**
 * 删除文章
 * @param {number} id - 文章ID
 * @returns {Promise} - 请求 Promise
 */
export const artDelService = (id) =>
  request.delete('/my/article/info', { params: { id } })
