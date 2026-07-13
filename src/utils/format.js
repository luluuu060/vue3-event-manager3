/**
 * @file format.js
 * @description 工具函数模块
 * @description 提供时间格式化等工具方法
 */

import { dayjs } from 'element-plus'

/**
 * 格式化时间
 * @param {string|Date} time - 需要格式化的时间
 * @returns {string} - 格式化后的时间字符串（YYYY-MM-DD HH:mm:ss）
 */
export const formatTime = (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
