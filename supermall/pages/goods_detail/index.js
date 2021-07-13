// pages/goods_detail/index.js
import { request } from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  // 商品对象
  goodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length-1];
    let {options} = currentPage;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

  },
  // 获取商品详情数据
  async getGoodsDetail (goods_id) {
    const goodsObj = await request({url: '/goods/detail',data: {goods_id}})
    this.goodsInfo = goodsObj;
    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect")||[];
    // 2.判断当前商品是否被收藏，some只要一个返回是true，那么全部返回true和every相反
    let isCollect = collect.some(v => v.goods_id === this.goodsInfo.goods_id);
    this.setData({
      // 获取页面要使用的数据，使data数据更少提升性能
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机不识别webp图片格式
        // 临时自己修改，确保后台存在1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics,
      },
      isCollect
    })
  },
  // 点击轮播图放大预览图片
  handlePrevewImage (e) {
    // 1.先构造要预览的图片数组
    const urls = this.goodsInfo.pics.map(v => v.pics_mid);
    // 2.接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  // 加入购物车
  handleCartAdd (e) {
    // 1.获取缓存中的购物车 数组，第一次是一个空数组格式所以转换成数组
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      // 3.不存在 第一次添加
      this.goodsInfo.num = 1;
      // 添加商品默认选中
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo);
    } else {
      // 4.已经存在购物车数据则执行num++
      cart[index].num++;
    }
    // 5.把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true防止用户手抖点击按钮
      mask: true
    });
  },
  // 点击收藏
  handleCollect () {
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 2. 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id=== this.goodsInfo.goods_id);
    // 3.当index ！= -1表示 已经收藏过
    if (index !== -1) {
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true,
        duration: 1000,
      });
    } else {
      // 没有收藏过
      collect.push(this.goodsInfo);// 存入对象
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
        duration: 1000,
      });
    }
    // 4.把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5.修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }

})