// pages/auth/index.js
import { login } from '../../utils/asyncWx.js'
import { request } from "../../request/index"
Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 1.获取用户信息
      const { encryptedDate, rawData, iv, signatrue } = e.detail;
      // 2.获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedDate, rawData, iv, signatrue, code };
      // 3.发送请求 获取用户的token
      const token = await request({ url: '/users/wxlogin', data: loginParams, methods: 'POST' });
      // 4.把token存入缓存中同时跳转回上一个页面
      wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      // 没有企业账号无法支付
      console.log(error)
      wx.navigateBack({
        delta: 1
      });
    }
  }
})