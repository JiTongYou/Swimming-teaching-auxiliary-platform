// miniprogram/pages/login/login.js
var that;
var db = wx.cloud.database().collection('defaultUserInfo');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     userInfo: null,
  },

  bindGetUserInfo:function(e){
     if(e.detail.userInfo){
        wx.setStorage({
          data:JSON.stringify(e.detail.userInfo),
          key:'userInfo',
          success(res){
            that.addUser(e.detail.userInfo)
          }
        })
     }
     else{

     }
  },

  addUser(userInfo){
     db.add({
       data:{
         nickName:userInfo.nickName,
         avatarUrl:userInfo.avatarUrl,
         gender:userInfo.gender,
         time: new Date()
       }
     })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     that = this;
  },

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