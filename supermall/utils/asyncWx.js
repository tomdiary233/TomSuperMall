/*
  Promise 新式的 getSetting
*/
export const getSetting = () => {
  return new Promise((resolve,reject) => {
     wx.getSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/*
  Promise 新式的 chooseAddress
*/
export const chooseAddress = () => {
  return new Promise((resolve,reject) => {
     wx.chooseAddress({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/*
  Promise 新式的 openSetting
*/
export const openSetting = () => {
  return new Promise((resolve,reject) => {
     wx.openSetting({
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/*
  Promise 新式的 showModal
*/
export const showModal = ({content}) => {
  return new Promise((resolve,reject) => {
    // 4.1弹窗提示
    wx.showModal({
      title: '提示',
      content: content,
      success: (res) => {
        resolve(res);
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}
/*
  Promise 新式的 showToast
*/
export const showToast = ({title}) => {
  return new Promise((resolve,reject) => {
    wx.showToast({
      title,
      icon: 'none',
      success: (res) => {
        resolve(res);
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}

/*
  Promise 新式的 login
*/
export const login = () => {
  return new Promise((resolve,reject) => {
    
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}

/*
  Promise 新式的 requestPayment微信支付
*/
export const requestPayment = (pay) => {
  return new Promise((resolve,reject) => {
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    });
  })
}

/*
  Promise 新式的 getUserInfo
*/
export const getUserInfo = () => {
  return new Promise((resolve,reject) => {
    wx.getUserInfo({
      withCredentials: 'true',
      lang: 'zh_CN',
      timeout:10000,
      success: (result)=>{
        resolve(result)
      }
    });
  })
}
/*
  Promise 新式的 getUserProfile
*/
export const getUserProfile = () => {
  return new Promise((resolve,reject) => {
    wx.getUserProfile({
      desc:'用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        resolve(res)
      },
      fail: (err)=>{
        reject(err)
      }
    })
  })
}