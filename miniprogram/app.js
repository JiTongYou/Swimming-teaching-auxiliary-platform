import mock from "./utils/mock";
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //云开发环境初始化
    wx.cloud.init({
      env:"cloud1-7gh3ock7a08defbd"
    })

    this.globalData = {}
   
    Object.assign(this.globalData, mock)
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        this.globalData.userInfo = JSON.parse(value);
      }
    } catch (e) {
      console.log('app js:', '用户未登录')
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }


})
