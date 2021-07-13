//Page Object
import { request } from "../../request/index"
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数组
    floorList: []
  },
  //options(Object)
  onLoad: function(options){
    // 发送异步请求数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: res => {
    //     console.log(res)
    //     this.setData({
    //       swiperList: res.data.message
    //     })
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },

  // 获取轮播图数据
  // getSwiperList () {
  //   request({url: '/home/swiperdata'})
  //     .then(result => {
  //       this.setData({
  //         swiperList: result
  //       })
  //     })
  // },
  getSwiperList() {
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        result.forEach((v, i) => {result[i].navigator_url = v.navigator_url.replace('main', 'index');});
        this.setData({
          swiperList: result
        })
      })
  },
  getCatesList () {
    request({url: '/home/catitems'})
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  getFloorList () {
    request({url: '/home/floordata'})
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },
  handleActive () {
    wx.showToast({
      title: '没做跳转',
      icon: 'none',
      mask: true
    })
  }
});