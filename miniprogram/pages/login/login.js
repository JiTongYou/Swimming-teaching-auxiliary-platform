// miniprogram/pages/login/login.js
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
     userInfo: null,
  },
 
  getUserProfile(){
    wx.getUserProfile({
      desc: '请填写个人信息',
      success:(res)=>{
        if(res.userInfo){
            that.addUser(res.userInfo)

        }
       else{
            wx.showToast({title:'拒绝授权',})
        }
      }
    })
  },

  onLoad: function (options) {
    that = this;
    if (getApp().globalData.userInfo) {
      wx.switchTab({
        url: '/pages/index/index',
      })
      that.setData({
        userInfo: getApp().globalData.userInfo
      })
    }
 },

  // bindGetUserInfo:function(e){
  //    if(e.detail.userInfo){
  //      // wx.setStorage({
  //       //  data:JSON.stringify(e.detail.userInfo),
  //       //  key:'userInfo',
  //       //  success(res){
  //       //    console.log('asd',res)
  //       //    
  //       //  }
  //     //  })
  //     that.addUser(e.detail.userInfo)
  //    }
  //    else{
  //       wx.showToast({title:'拒绝授权',})
  //    }
  // },

  addUser(userInfo){
    wx.showLoading({
    title:'正在登录', 
    })
    
    wx.cloud.callFunction({
      name:'login',
      data:{userInfo}
    }).then(res=>{

      this.setData({
        userInfo:res.result.data[0]
      })
      wx.setStorage({
        data: JSON.stringify(res.result.data[0]),
        key:'userInfo',
        success(res){
          getApp().globalData.userInfo=userInfo;
          wx.hideLoading() 
          wx.switchTab({
        url: '/pages/index/index',
      })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})