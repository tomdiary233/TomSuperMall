// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal,showToast } from '../../utils/asyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户地址
    address: {},
    // 用户购物车数据
    cart: [],
    // 全选
    allChecked: false,
    // 总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 1.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    // 2.计算全选
    // every数组方法会遍历会接收一个回调函数，每个回调函数会返回一个true，那么every方法的返回值为true
    // 如果有一个回调函数为false，那么every的返回值就为false，且函数不再执行
    // 空数组调用every，返回值就是true
    // const allChecked =cart.length ? cart.every(v => v.checked) : false;
    // let allChecked = true;
    // // 1.总价格 总数量
    // let totalPrice = 0;
    // let totalNum = 0;
    // cart.forEach(v => {
    //   if (v.checked) {
    //     totalPrice += v.num * v.goods_price;
    //     totalNum += v.num;
    //   } else {
    //     allChecked = false;
    //   }
    // });
    // // 判断数组是否为空
    // allChecked = cart.length != 0 ? allChecked : false;
    // // 2.给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })

    this.setData({ address });
    this.setCart(cart);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击 收获地址
  async handleChooseAddress() {
    try {
      // 1.获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 3.用户 以前拒绝过授予权限 先诱导用户打开授权页面
        await openSetting();
      }
      // 4.调用获取收货地址的api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 5.存入缓存中
      wx.setStorageSync('address', address);

    } catch (error) {
      console.log(error)
    }
    // 1.获取收获地址
    // wx.chooseAddress({
    //   success: (result)=>{
    //    console.log(result) 
    //   }
    // });
    // 2.假设用户点击获取收获地址的提示框确定 authSetting scope.addres
    // wx.getSetting({
    //   success: (result)=>{
    //     console.log(result)
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });

    // 1.获取 权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     // 2.获取权限状态 主要发现一些 属性名很怪异的时候 都要使用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         }
    //       });
    //     } else {
    //       // 3.用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2)=>{
    //           // 4.可以调用 收货地址代码
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             }
    //           });
    //         }
    //       });
    //     }
    //   },
    //   fail: () => { },
    //   complete: () => { }
    // });
  },
  // 商品的选中
  handeItemChange(e) {
    // 1.获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2.获取购物车数组
    let { cart } = this.data;
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4.被选中状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {

    let allChecked = true;
    // 1.总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 5 6 把购物车数据重新设置回data中和缓存中
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })

    wx.setStorageSync('cart', cart);
  },

  // 全选
  handleItemAllCheck() {
    // 1.获取data中的数据
    let { cart, allChecked } = this.data;
    // 2.修改值
    allChecked = !allChecked;
    // 3.循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4.把修改后的值填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品加减数量
  async handleItemNumEdit(e) {
    // 1.获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2.获取购物车数组
    let { cart } = this.data;
    // 3.找到要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id===id);
    // 4.判断是否要删除
    if (cart[index].num === 1 && operation === -1) {

      const res = await showModal({ content: '你是否删除商品？' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      } else if (res.cancel) {
        console.log("用户取消")
      }
    } else {
      // 4.进行修改数量
      cart[index].num += operation;
      // 5.设置回缓存和data中
      this.setCart(cart);
    }
  },

  // 商品结算
  async handlePay () {
    // 1.判断收货地址
    const {address,totalNum} = this.data;
    if (!address.userName) {
      await showToast({title:'你还没有添加收货地址'});
      return;
    }
    // 2.判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({title:'你还没有选购商品'});
      return;
    }
    // 3.跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})