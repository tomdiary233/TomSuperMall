import config from "./config";
// 同时发送异步请求代码的次数
let ajaxTimes = 0;
export const request = (params) => {
  // 判断url中是否带有/my/ 请求的是私有的路劲带上header token
  let header = {...params.header};
  if (params.url.includes("/my/")){
    // 拼接header带上token
    header['Authorization'] = wx.getStorageSync('token');
  }



  ajaxTimes++;
  // 显示请求加载效果
  wx.showLoading({
    title: '加载中',
    mask: true
  });
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      header:header,
      url: config.base_url+params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          // 关闭正在等待的图标
          wx.hideLoading();
        }
      }
    })
  })
}