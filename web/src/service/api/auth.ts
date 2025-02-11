import { request } from '../request';

/**
 * @param {Api.Auth.LoginParams} params
 * @description: 用户登录
 */
export const fetchLogin = (params: Api.Auth.LoginParams) =>
  request<Api.Auth.LoginToken>({
    data: params,
    method: 'post',
    url: '/auth/login'
  });

/** @description: 获取用户信息 */
export const fetchGetUserInfo = () => request<Api.Auth.UserInfo>({ url: '/auth/getUserInfo' });

/** @description: 获取图形验证码 */
export const getCaptcha = () => request({ url: '/auth/captcha' });

/** @description: 用户注销登录 */
export const fetchLogout = () =>
  request({
    method: 'post',
    url: '/auth/logout'
  });

/** @description: 国际化层级数据 */
export const getLocales = () => request({ url: '/auth/getLocales' });

/** @description: 获取掘金文章 */
export const getJuejinList = (params: Api.Auth.JuejinParams) =>
  request({ data: params, method: 'post', url: '/auth/juejin' });

/** @description: 上传图片 */
export const uploadSingleFile = (params: FormData) =>
  request({
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    url: '/upload/single-file'
  });
