import {request} from '../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 按钮是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ''
  },
  TimeId: -1,
  // 绑定input事件
  handleInput (e) {
    // 1.获取value的值
    const {value} = e.detail;
    // 2.判断合法性
    if (!value.trim()) {
      // 值不合法
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 3.准备发送请求
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    },1000);
  },
  // 发送请求获取搜索建议 数据
  async qsearch (query) {
    const res = await request({url: '/goods/qsearch', data:{query}})
    this.setData({
      goods: res
    })
  },
  // 清空
  handleCancle () {
    this.setData({
      goods: [],
      isFocus: false,
      inpValue: ''
    })
  }
})