// pages/order/index.js
import { request } from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
  },
  onShow () {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return
    }
    // 1.获取当前的小程序的页面-数组 长度最大是10页面
    let pages = getCurrentPages();
    // 2.数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    console.log(currentPage.options)
    // 3.获取url上的type参数 
    const { type } = currentPage.options;
    // 4.激活选中页面标题type-1 = index
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: { type } })
    this.setData({
      orders: res.orders.map(v => ({...v, create_time_cn: (new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex (index) {
    // 2.修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 2.重新发送页面请求
    this.getOrders(index+1);
  }
})