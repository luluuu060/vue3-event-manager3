/**
 * @file user.js
 * @description 用户模块 API 接口封装
 * @description 包含用户注册、登录、信息获取及个人中心相关接口
 */

import request from '@/utils/request'

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.repassword - 确认密码
 * @returns {Promise} - 请求 Promise
 */
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} - 请求 Promise
 */
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

/**
 * 获取用户基本信息
 * @returns {Promise} - 请求 Promise
 */
export const userInfoService = () => request.get('/my/userinfo')

/**
 * 更新用户信息
 * @param {Object} data - 用户信息
 * @param {string} data.username - 用户名
 * @param {string} data.nickname - 昵称
 * @param {string} data.email - 邮箱
 * @param {number} data.id - 用户ID
 * @returns {Promise} - 请求 Promise
 */
export const updateUserInfoService = ({ username, nickname, email, id }) =>
  request.put('/my/userinfo', { username, nickname, email, id })

/**
 * 上传用户头像
 * @param {string} avatar - 头像 Base64 字符串
 * @returns {Promise} - 请求 Promise
 */
export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

/**
 * 更新用户密码
 * @param {Object} data - 密码信息
 * @param {string} data.old_pwd - 原密码
 * @param {string} data.new_pwd - 新密码
 * @param {string} data.re_pwd - 确认新密码
 * @returns {Promise} - 请求 Promise
 */
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
